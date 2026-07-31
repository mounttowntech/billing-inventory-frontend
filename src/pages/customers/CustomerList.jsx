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
import Modal from "../../components/common/Modal";

import {
  AddButton,
  EditButton,
  DeleteButton,
  NextButton,
} from "../../components/Common/Button";

import CustomerForm from "./CustomerForm";

const Customer = () => {
  const dispatch = useDispatch();

  const { customers } = useSelector((state) => state.customer);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = rowsPerPage;

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
    dispatch(getCustomers({ page: 1, search: "" }));
    setShowModal(false);
  };

  const handleEdit = (customer) => {
    setEditId(customer._id);
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  return (
    <div className="customer-list-container">
      <div className="customer-header">
        <h2>Customer List</h2>

        <AddButton
          onClick={() => {
            setSelectedCustomer(null);
            setEditId(null);
            setShowModal(true);
          }}
        >
          Add
        </AddButton>
      </div>
      <div className="customer-container">
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
              placeholder="Search Customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showModal}
          title={editId === "add" ? "Add Customer" : "Edit Customer"}
          size="md"
          onClose={() => setShowModal(false)}
        >
          <CustomerForm
            mode={editId === "add" ? "add" : "edit"}
            customer={selectedCustomer}
            onSubmit={onSubmit}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              dispatch(getCustomers());
            }}
          />
        </Modal>

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

        <div className="user-pagination">
          <p>
            Showing {filteredCustomers.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredCustomers.length)}
            of {filteredCustomers.length} entries
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

export default Customer;
