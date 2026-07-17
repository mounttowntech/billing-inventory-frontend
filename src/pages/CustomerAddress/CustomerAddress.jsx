import { useEffect, useState } from "react";
import "./CustomerAddress.css";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../features/customerAddress/customerAddressSlice";

import { getCustomers } from "../../features/Customer/customerSlice";

import { customerAddressValidation } from "../../validations/CustomerAddressValidation";

import SearchBox from "../../components/Common/SearchBox";

import {
  AddButton,
  SaveButton,
  CancelButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";

const CustomerAddress = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [addresses, setAddresses] = useState([]);
  const { customers } = useSelector((state) => state.customer);

  // ================= Pagination =================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ================= Search =================
  // console.log("customerAddresses:", addresses);

  useEffect(() => {
    dispatch(getAddresses()).then((res) => {
      console.log("Payload:", res.payload);
      setAddresses(res.payload);
      console.log("Payload length:", res.payload.length);
    });

    dispatch(getCustomers()).then((res) => {
      console.log("Customers Response:", res);
    });
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
  // console.log("Current Addresses dat are the :", currentAddresses);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerAddressValidation),

    defaultValues: {
      customer: "",
      label: "home",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);

    if (editingId) {
      dispatch(
        updateAddress({
          id: editingId,
          addressData: data,
        }),
      ).then(() => {
        dispatch(getAddresses()).then((res) => {
          setAddresses(res.payload);
          reset();
          setEditingId(null);
          setShowModal(false);
        });
      });
    } else {
      dispatch(createAddress(data)).then(() => {
        dispatch(getAddresses()).then((res) => {
          setAddresses(res.payload);
          reset();
          setShowModal(false);
        });
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    reset({
      customer: item.customer?._id || "",
      label: item.label || "home",
      addressLine1: item.addressLine1 || "",
      addressLine2: item.addressLine2 || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      isDefault: item.isDefault || false,
    });

    setShowModal(true);
  };

  // ================= Delete =================

  const handleDelete = (id) => {
    if (window.confirm("Delete this Address?")) {
      dispatch(deleteAddress(id)).then(() => {
        dispatch(getAddresses());
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

        <AddButton
          onClick={() => {
            setEditingId(null);

            reset({
              customer: "",
              label: "home",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              pincode: "",
              isDefault: false,
            });

            setShowModal(true);
          }}
        >
          Add Address
        </AddButton>
      </div>

      {/* Part 2 Modal goes here */}

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
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            setEditingId(null);
            reset();
          }}
        >
          <div
            className="customeraddress-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingId ? "Update Customer Address" : "Add Customer Address"}
              </h3>

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

            <form
              className="customeraddress-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Customer */}
              <div className="form-group">
                <label>Customer</label>

                <select {...register("customer")}>
                  <option value="">Select Customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>

                <p>{errors.customer?.message}</p>
              </div>

              {/* Label */}
              <div className="form-group">
                <label>Label</label>

                <select {...register("label")}>
                  <option value="">Select Label</option>
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                </select>

                <p>{errors.label?.message}</p>
              </div>

              {/* Address Line 1 */}
              <div className="form-group">
                <label>Address Line 1</label>

                <input
                  type="text"
                  placeholder="Enter Address Line 1"
                  {...register("addressLine1")}
                />

                <p>{errors.addressLine1?.message}</p>
              </div>

              {/* Address Line 2 */}
              <div className="form-group">
                <label>Address Line 2</label>

                <input
                  type="text"
                  placeholder="Enter Address Line 2"
                  {...register("addressLine2")}
                />

                <p>{errors.addressLine2?.message}</p>
              </div>

              {/* City */}
              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  placeholder="Enter City"
                  {...register("city")}
                />

                <p>{errors.city?.message}</p>
              </div>

              {/* State */}
              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  placeholder="Enter State"
                  {...register("state")}
                />

                <p>{errors.state?.message}</p>
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  placeholder="Enter Pincode"
                  {...register("pincode")}
                />

                <p>{errors.pincode?.message}</p>
              </div>

              {/* Default Address */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" {...register("isDefault")} />
                  &nbsp;Set as Default Address
                </label>
              </div>

              <div className="form-buttons">
                <SaveButton type="submit">
                  {editingId ? "Update Address" : "Save Address"}
                </SaveButton>

                <CancelButton
                  type="button"
                  onClick={() => {
                    reset();
                    setEditingId(null);
                    setShowModal(false);
                  }}
                >
                  Cancel
                </CancelButton>
              </div>
            </form>
          </div>
        </div>
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
