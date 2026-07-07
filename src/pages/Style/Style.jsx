import React, { useEffect, useState } from "react";
import "./Style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getStyles,
  createStyle,
  updateStyle,
  deleteStyle,
} from "../../features/style/styleSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styleValidation } from "../../validations/styleValidation";

const Style = () => {
  const dispatch = useDispatch();

  const { styles, loading } = useSelector((state) => state.style);

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStyles = styles.slice(indexOfFirst, indexOfLast);

  const totalPages =
    styles.length > 0 ? Math.ceil(styles.length / itemsPerPage) : 1;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(styleValidation),
  });

  useEffect(() => {
    dispatch(getStyles());
  }, [dispatch]);

  const onSubmit = (data) => {
    if (editId) {
      dispatch(
        updateStyle({
          id: editId,
          styleData: data,
        }),
      ).then(() => {
        dispatch(getStyles());
        reset();
        setEditId(null);
        setShowModal(false);
      });
    } else {
      dispatch(createStyle(data)).then(() => {
        dispatch(getStyles());
        reset();
        setShowModal(false);
      });
    }
  };

  const handleEdit = (style) => {
    setEditId(style._id);

    setValue("styleName", style.styleName);
    setValue("styleCode", style.styleCode);

    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this style?")) {
      dispatch(deleteStyle(id)).then(() => {
        dispatch(getStyles());
      });
    }
  };

  return (
    <div className="style-container">
      <div className="style-header">
        <h2>Style Management</h2>

        <button
          className="btn btn-add"
          onClick={() => {
            reset();
            setEditId(null);
            setShowModal(true);
          }}
        >
          + Add Style
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editId ? "Update Style" : "Add Style"}</h2>

            <label className="field-label">Style Name</label>
            <input
              className="text-input"
              placeholder="Style Name"
              {...register("styleName")}
            />
            <p className="error-text">{errors.styleName?.message}</p>

            <label className="field-label">Style Code</label>
            <input
              className="text-input"
              placeholder="Style Code"
              {...register("styleCode")}
            />
            <p className="error-text">{errors.styleCode?.message}</p>

            <div className="modal-actions">
              <button
                className="btn btn-cancel"
                onClick={() => {
                  reset();
                  setEditId(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>

              <button className="btn btn-save" onClick={handleSubmit(onSubmit)}>
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <h3 className="loading-text">Loading...</h3>}

      <div className="table-wrapper">
        <table className="style-table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>STYLE NAME</th>
              <th>STYLE CODE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {currentStyles.length > 0 ? (
              currentStyles.map((style, index) => (
                <tr key={style._id}>
                  <td data-label="S.No">{indexOfFirst + index + 1}</td>
                  <td data-label="Style Name">{style.styleName}</td>
                  <td data-label="Style Code">{style.styleCode}</td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(style)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(style._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="4">No Styles Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn btn-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Style;
