import { useEffect, useState } from "react";
import "./CustomerList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../features/Customer/customerSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  EditButton,
  DeleteButton,
  NextButton,
} from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomerValidation from "../../validations/CustomerValidation";
import CustomerForm from "./CustomerForm";

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

  const [search, setSearch] = useState("");
  const filteredCustomers = currentCustomers.filter((customer) =>
    customer.customerName.toLowerCase().includes(search.toLowerCase()),
  );

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
      <div className="customer-header">
        <h2>Customer List</h2>
      </div>
      <div className="customer-search-buttons">
        <SearchBox
          placeholder="Search Fabric..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            setEditId(null);
            reset();
            setShowModal(true);
          }}
        >
          Add Customer
        </AddButton>
      </div>

      <CustomerForm
        showModal={showModal}
        setShowModal={setShowModal}
        editId={editId}
        setEditId={setEditId}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        reset={reset}
      />

      <table border="1" className="customer-table">
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
          {filteredCustomers.map((customer, index) => (
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

        <NextButton
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
