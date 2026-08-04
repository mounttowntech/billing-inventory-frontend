import { useEffect, useState } from "react";
import "./Sizes.css";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../components/Common/SearchBox";
import {
  getSizes,
  createSize,
  editSize,
  removeSize,
} from "../../features/Sizes/sizesSlice";
import {
  AddButton,
  EditButton,
  NextButton,
  PreviousButton,
  DeleteButton,
} from "../../components/Common/Button";
import SizeForm from "./SizeForm";
import Modal from "../../components/Common/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sizesValidation } from "../../validations/SizesValidation";

const Sizes = () => {
  const dispatch = useDispatch();
  const { sizes = [] } = useSelector((state) => state.sizes);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingSize, setEditingSize] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const filteredData = sizes.filter((size) =>
    size.sizeName.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentSizes = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages =
    filteredData.length > 0 ? Math.ceil(filteredData.length / rowsPerPage) : 1;

  const filteredSizes = currentSizes;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sizesValidation),
  });

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    console.log("handleFormSubmit data is ", data);
    if (editId) {
      dispatch(editSize({ id: editId, sizeData: data })).then(() =>
        dispatch(getSizes()),
      );
    } else {
      dispatch(createSize(data)).then(() => dispatch(getSizes()));
    }
    setEditId(null);
    setEditingSize(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditingSize(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingSize(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setEditingSize(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this size?")) {
      dispatch(removeSize(id)).then(() => dispatch(getSizes()));
    }
  };

  return (
    <div className="sizes-main-page">
      <div className="page-header">
        <h2>Size Management</h2>
        <AddButton
          onClick={() => {
            reset();
            setEditId(null);
            setShowForm(true);
            handleAdd();
          }}
        >
          Add
        </AddButton>
      </div>
      <div className="sizes-container">
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
              placeholder="Search Size..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <Modal
          open={showForm}
          title={editId ? "Edit Size" : "Add Size"}
          size="md"
          onClose={handleCancel}
        >
          <SizeForm
            size={editingSize}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>

        <table className="size-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Order</th>
              <th>Chest</th>
              <th>Waist</th>
              <th>Hip</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSizes.length ? (
              filteredSizes.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td>{s.sizeCode}</td>
                  <td>{s.sizeName}</td>
                  <td>{s.displayOrder}</td>
                  <td>{s.chest}</td>
                  <td>{s.waist}</td>
                  <td>{s.hip}</td>
                  <td>{s.status ? "Active" : "Inactive"}</td>
                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(s)} />
                    <DeleteButton onClick={() => handleDelete(s._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Sizes Found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="user-pagination">
          <p>
            Showing {filteredSizes.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredData.length)}
            of {filteredData.length} entries
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

export default Sizes;
