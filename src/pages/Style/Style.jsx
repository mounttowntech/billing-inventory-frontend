import React, { useEffect, useState } from "react";
import "./Style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getStyles,
  createStyle,
  updateStyle,
  deleteStyle,
} from "../../features/style/styleSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";
import StyleForm from "./StyleForm";

const Style = () => {
  const dispatch = useDispatch();

  const { styles, loading } = useSelector((state) => state.style);

  const [editId, setEditId] = useState(null);
  const [editingStyle, setEditingStyle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStyles = styles.slice(indexOfFirst, indexOfLast);
  const totalPages =
    styles.length > 0 ? Math.ceil(styles.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");
  const filteredStyles = currentStyles.filter((style) =>
    style.styleName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getStyles());
  }, [dispatch]);

  // Keep currentPage valid if the list shrinks (e.g. after a delete)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateStyle({
          id: editId,
          styleData: data,
        }),
      ).then(() => {
        dispatch(getStyles());
        setEditId(null);
        setEditingStyle(null);
        setShowModal(false);
      });
    } else {
      dispatch(createStyle(data)).then(() => {
        dispatch(getStyles());
        setShowModal(false);
      });
    }
  };

  const handleEdit = (style) => {
    setEditId(style._id);
    setEditingStyle(style);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingStyle(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditId(null);
    setEditingStyle(null);
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
      </div>
      <div className="style-actions">
        <SearchBox
          placeholder="Search Styles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Style</AddButton>
      </div>

      {showModal && (
        <StyleForm
          style={editingStyle}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
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
            {filteredStyles.length > 0 ? (
              filteredStyles.map((style, index) => (
                <tr key={style._id}>
                  <td data-label="S.No">{indexOfFirst + index + 1}</td>
                  <td data-label="Style Name">{style.styleName}</td>
                  <td data-label="Style Code">{style.styleCode}</td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <EditButton
                        className="btn btn-edit"
                        onClick={() => handleEdit(style)}
                      >
                        Edit
                      </EditButton>

                      <DeleteButton
                        className="btn btn-delete"
                        onClick={() => handleDelete(style._id)}
                      >
                        Delete
                      </DeleteButton>
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

export default Style;
