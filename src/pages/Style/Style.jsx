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
  const itemsPerPage = 1;
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
      <h2>Style Management</h2>

      <button
        onClick={() => {
          reset();
          setEditId(null);
          setShowModal(true);
        }}
      >
        Add Style
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editId ? "Update Style" : "Add Style"}</h2>

            <input placeholder="Style Name" {...register("styleName")} />

            <p>{errors.styleName?.message}</p>

            <input placeholder="Style Code" {...register("styleCode")} />

            <p>{errors.styleCode?.message}</p>

            <button onClick={handleSubmit(onSubmit)}>
              {editId ? "Update" : "Create"}
            </button>

            <button
              onClick={() => {
                reset();
                setEditId(null);
                setShowModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <h3>Loading...</h3>}

      <table border="1">
        <thead>
          <tr>
            <th>S.No</th>

            <th>Style Name</th>

            <th>Style Code</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentStyles.length > 0 ? (
            currentStyles.map((style, index) => (
              <tr key={style._id}>
                <td>{indexOfFirst + index + 1}</td>

                <td>{style.styleName}</td>

                <td>{style.styleCode}</td>

                <td>
                  <button onClick={() => handleEdit(style)}>Edit</button>

                  <button onClick={() => handleDelete(style._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No Styles Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
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
