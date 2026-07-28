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

const CustomerAddress = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [search, setSearch] = useState("");
  const [addresses, setAddresses] = useState([]);
  const { customers } = useSelector((state) => state.customer);

  // ================= Pagination =================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      setAddresses(res.payload);
    });

    dispatch(getCustomers());
  }, [dispatch]);

  const filteredAddresses = addresses?.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      (item.customer?.customerName || "").toLowerCase().includes(keyword) ||
      item.label?.toLowerCase().includes(keyword) ||
      item.city?.toLowerCase().includes(keyword) ||
      item.state?.toLowerCase().includes(keyword) ||
      item.pincode?.toLowerCase().includes(keyword)
    );
  });

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
    <div className="customeraddress-container">
      <div className="customeraddress-header">
        <h2>Customer Address Management</h2>
      </div>

      <div className="customeraddress-actions">
        <SearchBox
          placeholder="Search Address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AddButton onClick={handleAdd}>Add Address</AddButton>
      </div>

      <div className="table-wrapper">
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
                  <td style={{ textTransform: "capitalize" }}>{item.label}</td>
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

      {showModal && (
        <CustomerAddressForm
          address={editingAddress}
          editId={editingId}
          customers={customers}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

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

export default CustomerAddress;
