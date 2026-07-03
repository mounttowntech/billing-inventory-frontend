import { useEffect, useState } from "react";
import "./Brand.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../features/Brand/brandSlice";
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
      });
    } else {
      dispatch(createBrand(data)).then(() => {
        dispatch(fetchBrands());
        reset();
      });
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);

    setValue("brandCode", brand.brandCode);
    setValue("brandName", brand.brandName);
    setValue("description", brand.description);
    setValue("logo", brand.logo);
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit(onSubmit)}
          >
            {editId ? "Update Brand" : "Add Brand"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                reset();
                setEditId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                        className="brand-logo"
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>

                  <td>{brand.description}</td>

                  <td className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEdit(brand)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleDelete(brand._id)}
                    >
                      Delete
                    </button>
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
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Brand;
