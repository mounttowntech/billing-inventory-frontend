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
import Modal from "../../components/Common/Modal";

const Style = () => {
  const dispatch = useDispatch();

  const { styles, loading } = useSelector((state) => state.style);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const itemsPerPage = rowsPerPage;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStyles = styles.slice(indexOfFirst, indexOfLast);
  const totalPages =
    styles.length > 0 ? Math.ceil(styles.length / itemsPerPage) : 1;

  const [editId, setEditId] = useState(null);
  const [editingStyle, setEditingStyle] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    <div className="style-main-page">
      <div className="style-header">
        <h2>Style Management</h2>

        <AddButton onClick={handleAdd}>Add </AddButton>
      </div>
      <div className="style-container">
        <Modal
          open={showModal}
          title={editId ? "Edit Size" : "Add Size"}
          size="md"
          onClose={handleCancel}
        >
          <StyleForm
            style={editingStyle}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
        {loading && <h3 className="loading-text">Loading...</h3>}

        <div style={{ display: "flex" }}>
          <div className="entries">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>Entries</span>
          </div>
          <div style={{ marginLeft: "auto", marginBottom: "20px" }}>
            <SearchBox
              placeholder="Search Styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
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

        <div className="user-pagination">
          <p>
            Showing {filteredStyles.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredStyles.length)}
            of {filteredStyles.length} entries
          </p>

          <div className="page-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              &laquo;
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &rsaquo;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Style;
