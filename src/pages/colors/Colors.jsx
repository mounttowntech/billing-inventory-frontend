import { useEffect, useState } from "react";
import "./Colors.css";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getColors,
  createColor,
  updateColor,
  deleteColor,
} from "../../features/color/colorSlice";

import { colorValidation } from "../../validations/colorValidation";

import {
  AddButton,
  EditButton,
  PreviousButton,
  DeleteButton,
  NextButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";

const Colors = () => {
  const dispatch = useDispatch();

  const { colors = [], loading } = useSelector((state) => state.colors);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentColors = colors.slice(indexOfFirst, indexOfLast);
  const totalPages =
    colors.length > 0 ? Math.ceil(colors.length / itemsPerPage) : 1;

  const filteredColors = currentColors.filter((item) =>
    item.colorName?.toLowerCase().includes(search.toLowerCase()),
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(colorValidation),
    defaultValues: {
      status: true,
    },
  });

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  const onSubmit = (data) => {
    data.status = data.status === "true" || data.status === true;

    if (editId) {
      dispatch(
        updateColor({
          id: editId,
          colorData: data,
        }),
      ).then(() => {
        dispatch(getColors());

        reset({
          status: true,
        });

        setShowForm(false);
        setEditId(null);
      });
    } else {
      dispatch(createColor(data)).then(() => {
        dispatch(getColors());

        reset({
          status: true,
        });

        setShowForm(false);
      });
    }
  };

  const handleEdit = (color) => {
    setEditId(color._id);

    setValue("colorCode", color.colorCode);
    setValue("colorName", color.colorName);
    setValue("hexCode", color.hexCode);
    setValue("status", color.status ? "true" : "false");

    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this color?")) {
      dispatch(deleteColor(id)).then(() => {
        dispatch(getColors());
      });
    }
  };
  return (
    <div className="colors-container">
      <div className="colors-header">
        <h2>Color Management</h2>
      </div>

      <div className="colors-actions">
        <SearchBox
          placeholder="Search Colors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            reset({
              colorCode: "",
              colorName: "",
              hexCode: "",
              status: true,
            });

            setEditId(null);
            setShowForm(true);
          }}
        >
          Add Color
        </AddButton>
      </div>

      <table className="colors-table">
        <thead>
          <tr>
            <th>Color Code</th>
            <th>Color Name</th>
            <th>Hex Code</th>
            <th>Status</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredColors.length > 0 ? (
            filteredColors.map((color) => (
              <tr key={color._id}>
                <td>{color.colorCode}</td>
                <td>{color.colorName}</td>
                <td>{color.hexCode}</td>

                <td>
                  <span
                    className={
                      color.status ? "status-active" : "status-inactive"
                    }
                  >
                    {color.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <div
                    className="color-preview"
                    style={{
                      backgroundColor: color.hexCode,
                    }}
                  ></div>
                </td>

                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(color)} />

                  <DeleteButton onClick={() => handleDelete(color._id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No Colors Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowForm(false);
            setEditId(null);

            reset({
              status: true,
            });
          }}
        >
          <form
            className="color-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2>{editId ? "Edit Color" : "Add Color"}</h2>

            <div className="form-group">
              <label>Color Code</label>

              <input
                placeholder="Enter Color Code"
                {...register("colorCode")}
              />

              <p>{errors.colorCode?.message}</p>
            </div>

            <div className="form-group">
              <label>Color Name</label>

              <input
                placeholder="Enter Color Name"
                {...register("colorName")}
              />

              <p>{errors.colorName?.message}</p>
            </div>

            <div className="form-group">
              <label>Hex Code</label>

              <input
                type="text"
                placeholder="#FF0000"
                {...register("hexCode")}
              />

              <p>{errors.hexCode?.message}</p>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select {...register("status")}>
                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="form-buttons">
              <SaveButton type="submit">
                {editId ? "Update" : "Save"}
              </SaveButton>

              <CancelButton
                type="button"
                onClick={() => {
                  reset({
                    status: true,
                  });

                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </CancelButton>
            </div>
          </form>
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

export default Colors;
