import { useEffect, useState } from "react";
import "./Colors.css";

import { useDispatch, useSelector } from "react-redux";
import ColorForm from "./ColorForm";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getColors,
  createColor,
  updateColor,
  deleteColor,
} from "../../features/color/colorSlice";

import Modal from "../../components/Common/Modal";

import { colorValidation } from "../../validations/colorValidation";

import {
  AddButton,
  EditButton,
  PreviousButton,
  DeleteButton,
  NextButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";

const Colors = () => {
  const dispatch = useDispatch();

  const { colors = [], loading } = useSelector((state) => state.colors);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingColor, setEditingColor] = useState(null);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit

  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 3;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentColors = colors.slice(indexOfFirst, indexOfLast);
  const totalPages =
    colors.length > 0 ? Math.ceil(colors.length / rowsPerPage) : 1;

  const filteredColors = currentColors.filter((item) =>
    item.colorName?.toLowerCase().includes(search.toLowerCase()),
  );

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(colorValidation),
  //   defaultValues: {
  //     status: true,
  //   },
  // });

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateColor({
          id: editId,
          colorData: data,
        }),
      ).then(() => {
        dispatch(getColors());
        setShowForm(false);
        setEditId(null);
        setEditingColor(null);
      });
    } else {
      dispatch(createColor(data)).then(() => {
        dispatch(getColors());
        setShowForm(false);
      });
    }
  };

  const handleEdit = (color) => {
    setSelectedColor(color);
    setMode("edit");
    setEditId(color._id);

    // setValue("colorCode", color.colorCode);
    // setValue("colorName", color.colorName);
    // setValue("hexCode", color.hexCode);
    // setValue("status", color.status ? "true" : "false");

    setOpenModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingColor(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setEditingColor(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this color?")) {
      dispatch(deleteColor(id)).then(() => {
        dispatch(getColors());
      });
    }
  };

  return (
    <div className="page-container">
      {/* <div className="colors-header">
        <h2>Color Management</h2>
      </div> */}
      <div className="page-header">
        <h2>Color Management</h2>

        <button
          className="btn-primary"
          onClick={() => {
            setMode("add");
            setSelectedColor(null);
            setOpenModal(true);
          }}
        >
          + Add
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
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

          <input
            className="user-search-box"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
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
                  <td>{colors.indexOf(color) + 1}</td>
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

        <div className="user-pagination">
          <p>
            Showing {filteredColors.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredColors.length)}
            of {filteredColors.length} entries
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

      <Modal
        open={openModal}
        title={mode === "add" ? "Add Color" : "Edit Color"}
        size="md"
        onClose={() => setOpenModal(false)}
      >
        <ColorForm
          mode={mode}
          color={selectedColor}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            dispatch(getColors());
          }}
        />
      </Modal>

      {/* <div className="colors-actions">
        <SearchBox
          placeholder="Search Colors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Color</AddButton>
      </div>

      <table className="colors-table">
        <thead>
          <tr>
            <th>#</th>
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
                <td>{colors.indexOf(color) + 1}</td>
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
        <ColorForm
          color={editingColor}
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
      </div> */}
    </div>
  );
};

export default Colors;
