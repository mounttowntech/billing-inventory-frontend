import { useEffect, useState } from "react";
import "./Brand.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../features/Brand/brandSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import BrandForm from "./BrandForm";
import Modal from "../../components/Common/Modal";

const Brand = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);

  const { brands = [], loading } = useSelector((state) => state.brand);

  const filteredBrands = brands.filter((brand) =>
    (brand.brandName || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages =
    filteredBrands.length > 0
      ? Math.ceil(filteredBrands.length / rowsPerPage)
      : 1;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentBrands = filteredBrands.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        updateBrand({
          id: editId,
          brand: data,
        }),
      ).then(() => {
        dispatch(fetchBrands());
        setEditId(null);
        setEditingBrand(null);
        setShowModal(false);
      });
    } else {
      dispatch(createBrand(data)).then(() => {
        dispatch(fetchBrands());
        setShowModal(false);
      });
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setEditingBrand(brand);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingBrand(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditingBrand(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this Brand?")) {
      dispatch(deleteBrand(id)).then(() => {
        dispatch(fetchBrands());
      });
    }
  };

  return (
    <div className="brand-container-page">
      <h2 className="brand-title">Brand Management</h2>
      <AddButton onClick={handleAdd}>+ Add Brand</AddButton>
      <div className="brand-container">
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
            <SearchBox
              placeholder="Search Brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editId ? "Edit Brand" : "Add Brand"}
          size="md"
          onClose={handleCancel}
        >
          <BrandForm
            brand={editingBrand}
            editId={editId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            onClose={handleCancel}
          />
        </Modal>

        {loading && <p>Loading...</p>}
        <div className="table-wrapper">
          <table className="brand-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Brand Code</th>
                <th>Brand Name</th>
                <th>Logo</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentBrands.length > 0 ? (
                currentBrands.map((brand, index) => (
                  <tr key={brand._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{brand.brandCode}</td>
                    <td>{brand.brandName}</td>
                    <td>
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.brandName}
                          style={{
                            width: "150px",
                            height: "50px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        "No Logo"
                      )}
                    </td>
                    <td>{brand.description}</td>
                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(brand)}>
                        Edit
                      </EditButton>
                      <DeleteButton onClick={() => handleDelete(brand._id)}>
                        Delete
                      </DeleteButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Brands Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="user-pagination">
          <p>
            Showing {filteredBrands.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredBrands.length)}
            of {filteredBrands.length} entries
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

export default Brand;
