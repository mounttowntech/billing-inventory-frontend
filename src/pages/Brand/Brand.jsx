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

  const { brands = [], loading } = useSelector((state) => state.brand);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  // Search
  const [search, setSearch] = useState("");

  const filteredBrands = currentBrands.filter((brand) =>
    brand.brandName.toLowerCase().includes(search.toLowerCase()),
  );
  const [showModal, setShowModal] = useState(false);

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
    <div className="brand-container">
      <h2 className="brand-title">Brand Management</h2>

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

              <input type="text" placeholder="Logo URL" {...register("logo")} />
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

      <div className="brand-actions">
        <SearchBox
          placeholder="Search Brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            reset();
            setEditId(null);
            setShowModal(true);
          }}
        >
          Add Brand
        </AddButton>
      </div>

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
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
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

      <div className="pagination">
        <NextButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </NextButton>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <NextButton
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Brand;
