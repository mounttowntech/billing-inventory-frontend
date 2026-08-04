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
import Select from "../../components/Common/Select";
import Modal from "../../components/Common/Modal";
import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import StoreForm from "./StoreForm";

const Store = () => {
  const dispatch = useDispatch();

  const { stores = [], loading } = useSelector((state) => state.store || {});

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedStore, setSelectedStore] = useState(null);
  const itemsPerPage = rowsPerPage;
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
      setSelectedStore(store);
      dispatch(getStores());
    }
  };

  // ================= Edit =================

  const handleEdit = (store) => {
    setEditingId(store._id);
    setSelectedStore(store);
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
    <div className="store-main">
      <div className="store-header">
        <h2>Store Management</h2>

        <AddButton
          className="add-btn"
          onClick={() => {
            setEditingId("add");
            setSelectedStore(null);
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
          Add
        </AddButton>
      </div>
      <div className="store-container">
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
          <div style={{ marginLeft: "auto" }}>
            <SearchBox
              placeholder="Search Store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editingId === "add" ? "Add Store" : "Edit Store"}
          onClose={() => setShowModal(false)}
        >
          <StoreForm
            mode={editingId === "add" ? "add" : "edit"}
            store={selectedStore}
            onSubmit={onSubmit}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              dispatch(getStores());
            }}
          />
        </Modal>
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

        <div className="user-pagination">
          <p>
            Showing {filteredStores.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredStores.length)}
            of {filteredStores.length} entries
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

export default Store;
