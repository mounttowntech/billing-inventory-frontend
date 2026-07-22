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
  SaveButton,
  CancelButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandValidation } from "../../validations/brandValidation";

const Brand = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(brandValidation),
    defaultValues: {
      brandCode: "",
      brandName: "",
      description: "",
      logo: "",
    },
  });
  console.log(
    "rowsPerPage:",
    rowsPerPage,
    "currentBrands:",
    currentBrands.length,
  );
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const onSubmit = (data) => {
    if (editId) {
      dispatch(
        updateBrand({
          id: editId,
          brand: data,
        }),
      ).then(() => {
        dispatch(fetchBrands());
        reset();
        setEditId(null);
        setShowModal(false);
      });
    } else {
      dispatch(createBrand(data)).then(() => {
        dispatch(fetchBrands());
        reset();
        setShowModal(false);
      });
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);

    setValue("brandCode", brand.brandCode);
    setValue("brandName", brand.brandName);
    setValue("description", brand.description);
    setValue("logo", brand.logo);
    setShowModal(true);
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

      <AddButton
        onClick={() => {
          reset();
          setEditId(null);
          setShowModal(true);
        }}
      >
        Add Brand
      </AddButton>
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

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editId ? "Update Brand" : "Add Brand"}</h2>

              <div className="brand-form">
                <input
                  type="text"
                  placeholder="Brand Code"
                  {...register("brandCode")}
                />
                <p className="error">{errors.brandCode?.message}</p>

                <input
                  type="text"
                  placeholder="Brand Name"
                  {...register("brandName")}
                />
                <p className="error">{errors.brandName?.message}</p>

                <input
                  type="text"
                  placeholder="Logo URL"
                  {...register("logo")}
                />
                <p className="error">{errors.logo?.message}</p>

                <textarea
                  placeholder="Description"
                  rows="3"
                  {...register("description")}
                />
                <p className="error">{errors.description?.message}</p>

                <div className="form-buttons">
                  <EditButton onClick={handleSubmit(onSubmit)}>
                    {editId ? "Update Brand" : "Add Brand"}
                  </EditButton>

                  <CancelButton
                    onClick={() => {
                      reset();
                      setEditId(null);
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </CancelButton>
                </div>
              </div>
            </div>
          </div>
        )}

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
