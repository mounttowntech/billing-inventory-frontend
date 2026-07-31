import { useEffect, useState } from "react";
import "./CustomerAddress.css";

import { useDispatch, useSelector } from "react-redux";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../features/customerAddress/customerAddressSlice";

import { getCustomers } from "../../features/Customer/customerSlice";

import SearchBox from "../../components/Common/SearchBox";

import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

import CustomerAddressForm from "./CustomerAddressForm";
import Modal from "../../components/common/Modal";

const CustomerAddress = () => {
  const dispatch = useDispatch();

  const { customers } = useSelector((state) => state.customer);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  // Search
  const [search, setSearch] = useState("");

  // Data
  const [addresses, setAddresses] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const itemsPerPage = rowsPerPage;

  // Fetch Data
  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      setAddresses(res.payload);
    });

    dispatch(getCustomers());
  }, [dispatch]);

  // Search Filter
  const filteredAddresses = addresses?.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      (item.customer?.customerName || "").toLowerCase().includes(keyword) ||
      (item.label || "").toLowerCase().includes(keyword) ||
      (item.city || "").toLowerCase().includes(keyword) ||
      (item.state || "").toLowerCase().includes(keyword) ||
      (item.pincode || "").toLowerCase().includes(keyword)
    );
  });

  // Pagination Calculation
  const totalPages =
    filteredAddresses.length > 0
      ? Math.ceil(filteredAddresses.length / itemsPerPage)
      : 1;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentAddresses = filteredAddresses.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleFormSubmit = (data) => {
    if (editingId) {
      dispatch(
        updateAddress({
          id: editingId,
          addressData: data,
        }),
      ).then(() => {
        dispatch(getAddresses()).then((res) => {
          setAddresses(res.payload);
          setEditingId(null);
          setEditingAddress(null);
          setShowModal(false);
        });
      });
    } else {
      dispatch(createAddress(data)).then(() => {
        dispatch(getAddresses()).then((res) => {
          setAddresses(res.payload);
          setShowModal(false);
        });
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditingAddress(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingAddress(null);
  };

  // ================= Delete =================

  const handleDelete = (id) => {
    if (window.confirm("Delete this Address?")) {
      dispatch(deleteAddress(id)).then(() => {
        dispatch(getAddresses()).then((res) => {
          setAddresses(res.payload);
        });
      });
    }
  };

  return (
    <div className="customeraddress-main">
      <div className="customeraddress-header">
        <h2>Customer Address Management</h2>

        <AddButton onClick={handleAdd}>Add </AddButton>
      </div>
      <div className="customer-address-container">
        <div className="table-wrapper">
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
                placeholder="Search Address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Modal
            open={showModal}
            title={editingId ? "Edit Address" : "Add Address"}
            size="md"
            onClose={handleCancel}
          >
            <CustomerAddressForm
              mode={editingId ? "edit" : "add"}
              address={editingAddress}
              customers={customers}
              onSubmit={handleFormSubmit}
              onClose={handleCancel}
              onSuccess={() => {
                handleCancel();
                dispatch(getCustomerAddresses());
              }}
            />
          </Modal>
          <table className="customeraddress-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Customer</th>
                <th>Label</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>City</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentAddresses.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    No Customer Addresses Found
                  </td>
                </tr>
              ) : (
                currentAddresses.map((item, index) => (
                  <tr key={item._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{item.customer?.customerName || "-"}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {item.label}
                    </td>
                    <td>{item.addressLine1}</td>
                    <td>{item.addressLine2 || "-"}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.pincode}</td>
                    <td>{item.isDefault ? "Yes" : "No"}</td>

                    <td className="action-buttons">
                      <EditButton onClick={() => handleEdit(item)} />
                      <DeleteButton onClick={() => handleDelete(item._id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="user-pagination">
          <p>
            Showing {filteredAddresses.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredAddresses.length)}
            of {filteredAddresses.length} entries
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

export default CustomerAddress;
