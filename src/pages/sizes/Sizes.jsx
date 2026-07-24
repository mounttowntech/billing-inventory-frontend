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

const Sizes = () => {
  const dispatch = useDispatch();
  const { sizes = [] } = useSelector((state) => state.sizes);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingSize, setEditingSize] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSizes = sizes.slice(indexOfFirst, indexOfLast);
  const totalPages =
    sizes.length > 0 ? Math.ceil(sizes.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");

  const filteredSizes = currentSizes.filter((size) =>
    size.sizeName.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
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
    <div className="sizes-container">
      <div className="page-header">
        <h2>Size Management</h2>
      </div>
      <div className="size-actions">
        <SearchBox
          placeholder="Search Size..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Size</AddButton>
      </div>

      {showForm && (
        <SizeForm
          size={editingSize}
          editId={editId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

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

export default Sizes;
