import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchBox from "../../components/Common/SearchBox";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../features/unit/unitSlice";

import { unitValidation } from "../../validations/UnitValidation";

import {
  AddButton,
  EditButton,
  DeleteButton,
  SaveButton,
  PreviousButton,
  NextButton,
  CancelButton,
} from "../../components/Common/Button";

import "./Unit.css";

const Unit = () => {
  const { units, isLoading } = useSelector((state) => state.unit);

  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUnits = units.slice(indexOfFirst, indexOfLast);
  const totalPages =
    units.length > 0 ? Math.ceil(units.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");

  const filteredUnits = currentUnits.filter((unit) =>
    unit.name.toLowerCase().includes(search.toLowerCase()),
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unitValidation),
    defaultValues: {
      name: "",
      shortName: "",
      allowDecimal: false,
      description: "",
    },
  });

  useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const onSubmit = (data) => {
    if (editId) {
      dispatch(
        updateUnit({
          id: editId,
          unitData: data,
        }),
      ).then(() => {
        dispatch(getUnits());
        reset();
        setEditId(null);
        setShowForm(false);
      });
    } else {
      dispatch(createUnit(data)).then(() => {
        dispatch(getUnits());
        reset();
        setShowForm(false);
      });
    }
  };

  const handleEdit = (unit) => {
    setEditId(unit._id);

    reset({
      name: unit.name,
      shortName: unit.shortName,
      allowDecimal: unit.allowDecimal,
      description: unit.description,
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Unit?")) {
      dispatch(deleteUnit(id)).then(() => {
        dispatch(getUnits());
      });
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="unit-container">
      <div className="unit-header">
        <h2>Unit Management</h2>
      </div>
      <div className="unit-actions">
        <SearchBox
          placeholder="Search Unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AddButton
          onClick={() => {
            reset({
              name: "",
              shortName: "",
              allowDecimal: false,
              description: "",
            });

            setEditId(null);
            setShowForm(true);
          }}
        >
          Add Unit
        </AddButton>
      </div>

      <table className="unit-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Unit Name</th>
            <th>Short Name</th>
            <th>Allow Decimal</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUnits?.length > 0 ? (
            filteredUnits.map((unit, index) => (
              <tr key={unit._id}>
                <td>{index + 1}</td>

                <td>{unit.name}</td>

                <td>{unit.shortName}</td>

                <td>{unit.allowDecimal ? "Yes" : "No"}</td>

                <td>{unit.description}</td>

                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(unit)} />

                  <DeleteButton onClick={() => handleDelete(unit._id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No Units Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay">
          <div className="unit-modal">
            <div className="unit-modal-header">
              <h3>{editId ? "Edit Unit" : "Add Unit"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  reset();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="unit-form-group">
                <label>Unit Name</label>

                <input
                  type="text"
                  placeholder="Enter Unit Name"
                  {...register("name")}
                />

                <p>{errors.name?.message}</p>
              </div>

              <div className="unit-form-group">
                <label>Short Name</label>

                <input
                  type="text"
                  placeholder="Eg. Kg, Pc, Box"
                  {...register("shortName")}
                />

                <p>{errors.shortName?.message}</p>
              </div>

              <div className="unit-form-group">
                <label>Allow Decimal</label>

                <select {...register("allowDecimal")}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>

                <p>{errors.allowDecimal?.message}</p>
              </div>

              <div className="unit-form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  placeholder="Enter Description"
                  {...register("description")}
                />

                <p>{errors.description?.message}</p>
              </div>

              <div className="unit-form-buttons">
                <SaveButton type="submit">
                  {editId ? "Update Unit" : "Save Unit"}
                </SaveButton>

                <CancelButton
                  onClick={() => {
                    reset();
                    setEditId(null);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </CancelButton>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="pagination">
        <PreviousButton
          className="btn btn-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          className="btn btn-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Unit;
