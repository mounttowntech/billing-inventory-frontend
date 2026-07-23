import { useEffect, useState } from "react";
import "./Store.css";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeValidation } from "../../validations/StoreValidation";
import SearchBox from "../../components/Common/SearchBox";
import {
  getStores,
  createStore,
  updateStore,
  deleteStore,
} from "../../features/store/storeSlice";

import {
  AddButton,
  SaveButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";

const Store = () => {
  const dispatch = useDispatch();

  const { stores = [], loading } = useSelector((state) => state.store || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStores = stores.slice(indexOfFirst, indexOfLast);
  const totalPages =
    stores.length > 0 ? Math.ceil(stores.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");
  const filteredStores = currentStores.filter((store) =>
    store.storeName.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(storeValidation),
  });

  useEffect(() => {
    dispatch(getStores());
  }, [dispatch]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ================= Save / Update =================

  const onSubmit = async (data) => {
    const storeData = {
      storeCode: data.storeCode,
      storeName: data.storeName,
      gstNumber: data.gstNumber,
      phone: data.phone,
      email: data.email,

      address: {
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },

      status: data.status,
    };

    let result;

    if (editingId) {
      result = await dispatch(
        updateStore({
          id: editingId,
          store: storeData,
        }),
      );
    } else {
      result = await dispatch(createStore(storeData));
    }

    if (!result.error) {
      reset();
      setEditingId(null);
      setShowModal(false);
      dispatch(getStores());
    }
  };

  // ================= Edit =================

  const handleEdit = (store) => {
    setEditingId(store._id);

    reset({
      storeCode: store.storeCode || "",
      storeName: store.storeName || "",
      gstNumber: store.gstNumber || "",
      phone: store.phone || "",
      email: store.email || "",

      addressLine: store.address?.addressLine || "",
      city: store.address?.city || "",
      state: store.address?.state || "",
      pincode: store.address?.pincode || "",

      status: store.status || "active",
    });

    setShowModal(true);
  };

  // ================= Delete =================

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Store?")) {
      const result = await dispatch(deleteStore(id));

      if (!result.error) {
        dispatch(getStores());
      }
    }
  };
  return (
    <div className="store-container">
      <div className="store-header">
        <h2>Store Management</h2>
      </div>
      <div className="store-search-buttons">
        <SearchBox
          placeholder="Search Supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          className="add-btn"
          onClick={() => {
            setEditingId(null);

            reset({
              storeCode: "",
              storeName: "",
              gstNumber: "",
              phone: "",
              email: "",
              addressLine: "",
              city: "",
              state: "",
              pincode: "",
              status: "active",
            });

            setShowModal(true);
          }}
        >
          + Add Store
        </AddButton>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="store-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? "Edit Store" : "Add Store"}</h3>

              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  reset();
                }}
              >
                ×
              </button>
            </div>

            <form className="store-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Store Code</label>

                <input
                  type="text"
                  placeholder="Enter Store Code"
                  {...register("storeCode")}
                />

                <span>{errors.storeCode?.message}</span>
              </div>

              <div className="form-group">
                <label>Store Name</label>

                <input
                  type="text"
                  placeholder="Enter Store Name"
                  {...register("storeName")}
                />

                <span>{errors.storeName?.message}</span>
              </div>

              <div className="form-group">
                <label>GST Number</label>

                <input
                  type="text"
                  placeholder="Enter GST Number"
                  {...register("gstNumber")}
                />

                <span>{errors.gstNumber?.message}</span>
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  {...register("phone")}
                />

                <span>{errors.phone?.message}</span>
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("email")}
                />

                <span>{errors.email?.message}</span>
              </div>

              <div className="form-group">
                <label>Address</label>

                <input
                  type="text"
                  placeholder="Enter Address"
                  {...register("addressLine")}
                />

                <span>{errors.addressLine?.message}</span>
              </div>

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  placeholder="Enter City"
                  {...register("city")}
                />

                <span>{errors.city?.message}</span>
              </div>

              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  placeholder="Enter State"
                  {...register("state")}
                />

                <span>{errors.state?.message}</span>
              </div>

              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  placeholder="Enter Pincode"
                  {...register("pincode")}
                />

                <span>{errors.pincode?.message}</span>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select {...register("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <span>{errors.status?.message}</span>
                <SaveButton type="submit" className="btn-save">
                  {editingId ? "Update Store" : "Save Store"}
                </SaveButton>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table className="store-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Store Code</th>
              <th>Store Name</th>
              <th>GST Number</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th className="supplier-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredStores.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Stores Found
                </td>
              </tr>
            ) : (
              filteredStores.map((store) => (
                <tr key={store._id}>
                  <td>{indexOfFirst + filteredStores.indexOf(store) + 1}</td>
                  <td>{store.storeCode}</td>

                  <td>{store.storeName}</td>

                  <td>{store.gstNumber || "-"}</td>

                  <td>{store.phone}</td>

                  <td>{store.email}</td>

                  <td>
                    {store.address
                      ? `${store.address.addressLine || ""}, ${
                          store.address.city || ""
                        }, ${store.address.state || ""} - ${
                          store.address.pincode || ""
                        }`
                      : "-"}
                  </td>

                  <td
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "600",
                    }}
                  >
                    {store.status}
                  </td>

                  <td className="supplier-column">
                    <EditButton onClick={() => handleEdit(store)}>
                      Edit
                    </EditButton>

                    <DeleteButton onClick={() => handleDelete(store._id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <PreviousButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Store;
