import React, { useEffect, useState } from "react";
import "./CustomerList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../features/Customer/customerSlice";
import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomerValidation from "../../validations/CustomerValidation";

const Customer = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customer);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CustomerValidation),
  });

  useEffect(() => {
    dispatch(getCustomers({ page: 1, search: "" }));
  }, [dispatch]);

  const onSubmit = (data) => {
    if (editId) {
      dispatch(updateCustomer({ id: editId, data }));
      setEditId(null);
    } else {
      dispatch(createCustomer(data));
    }
    reset();
    setShowModal(false);
  };

  const handleEdit = (customer) => {
    setEditId(customer._id);

    reset({
      customerCode: customer.customerCode,
      customerName: customer.customerName,
      phone: customer.phone,
      email: customer.email,
    });
    setShowModal(true);
  };

  return (
    <div className="customer-container">
      <button
        className="customer-header"
        onClick={() => {
          setEditId(null);
          reset();
          setShowModal(true);
        }}
      >
        Add Customer
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editId ? "Update Customer" : "Add Customer"}</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                placeholder="Customer Code"
                {...register("customerCode")}
              />
              <p>{errors.customerCode?.message}</p>

              <input
                placeholder="Customer Name"
                {...register("customerName")}
              />
              <p>{errors.customerName?.message}</p>

              <input placeholder="Phone" {...register("phone")} />
              <p>{errors.phone?.message}</p>

              <input placeholder="Email" {...register("email")} />
              <p>{errors.email?.message}</p>

              <button type="submit">{editId ? "Update" : "Save"}</button>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditId(null);
                  reset();
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table border="1" className="table-container">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Code</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentCustomers.map((customer, index) => (
            <tr key={customer._id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{customer.customerCode}</td>

              <td>{customer.customerName}</td>

              <td>{customer.phone}</td>

              <td>{customer.email}</td>

              <td className="action-buttons">
                <EditButton onClick={() => handleEdit(customer)}>
                  Edit
                </EditButton>

                <DeleteButton
                  onClick={() => dispatch(deleteCustomer(customer._id))}
                >
                  Delete
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <PreviousButton
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <NextButton
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Customer;
