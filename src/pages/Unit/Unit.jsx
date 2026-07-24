import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../components/Common/SearchBox";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../features/unit/unitSlice";

import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

import UnitForm from "./UnitForm";

import "./Unit.css";

const Unit = () => {
  const { units, isLoading } = useSelector((state) => state.unit);

  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);

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

  useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateUnit({
          id: editId,
          unitData: data,
        }),
      ).then(() => {
        dispatch(getUnits());
        setEditId(null);
        setEditingUnit(null);
        setShowForm(false);
      });
    } else {
      dispatch(createUnit(data)).then(() => {
        dispatch(getUnits());
        setShowForm(false);
      });
    }
  };

  const handleEdit = (unit) => {
    setEditId(unit._id);
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingUnit(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setEditingUnit(null);
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

        <AddButton onClick={handleAdd}>Add Unit</AddButton>
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
        <UnitForm
          unit={editingUnit}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
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
