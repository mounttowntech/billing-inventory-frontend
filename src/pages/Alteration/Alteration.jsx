import { useEffect, useState } from "react";
import "./Alteration.css";

import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../../features/Customer/customerSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  getAlterations,
  createAlteration,
  editAlteration,
  removeAlteration,
} from "../../features/Alteration/alterationSlice";
import Modal from "../../components/Common/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchInvoices } from "../../features/Invoice/invoiceSlice";
import { alterationValidation } from "../../validations/AlterationValidation";

import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import AlterationForm from "./AlterationForm";

const Alteration = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customer);
  const { alterations } = useSelector((state) => state.alteration);
  const { invoices } = useSelector((state) => state.invoice);

  const [editId, setEditId] = useState(null);
  const [editingAlteration, setEditingAlteration] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemsPerPage = rowsPerPage;

  const filteredAlterations = alterations.filter((item) => {
    const keyword = search.trim().toLowerCase();

    return (
      item.productName?.toLowerCase().includes(keyword) ||
      item.customer?.customerName?.toLowerCase().includes(keyword) ||
      item.invoice?.invoiceNo?.toLowerCase().includes(keyword) ||
      item.alterationType?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(alterationValidation),
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentAlterations = filteredAlterations.slice(
    indexOfFirst,
    indexOfLast,
  );

  const totalPages = Math.ceil(filteredAlterations.length / itemsPerPage) || 1;

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    dispatch(getAlterations());
  }, [dispatch]);

  const handleFormSubmit = (data) => {
    if (editId) {
      dispatch(
        editAlteration({
          id: editId,
          alterationData: data,
        }),
      ).then(() => {
        dispatch(getAlterations());
        setEditId(null);
        setEditingAlteration(null);
        setShowForm(false);
      });
    } else {
      dispatch(createAlteration(data)).then(() => {
        dispatch(getAlterations());
        setShowForm(false);
      });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditingAlteration(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setEditingAlteration(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setEditingAlteration(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this alteration?")) {
      dispatch(removeAlteration(id)).then(() => dispatch(getAlterations()));
    }
  };

  return (
    <div className="alteration-main">
      <div className="page-header">
        <h2>Alteration Management</h2>

        <AddButton onClick={handleAdd}>Add </AddButton>
      </div>

      <div className="alteration-container">
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
              placeholder="Search alterations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Modal
          open={showForm}
          title={editId ? "Edit Alteration" : "Add Alteration"}
          size="md"
          onClose={handleCancel}
        >
          <AlterationForm
            alteration={editingAlteration}
            editId={editId}
            customers={customers}
            invoices={invoices}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
        <table className="alteration-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Product</th>
              <th>Type</th>
              <th>Charge</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(currentAlterations || []).map((item, index) => (
              <tr key={item._id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{item.customer?.customerName}</td>
                <td>{item.invoice?.invoiceNo}</td>
                <td>{item.productName}</td>
                <td>{item.alterationType}</td>
                <td>{item.alterationCharge}</td>
                <td>{item.expectedDeliveryDate?.substring(0, 10)}</td>
                <td>{item.status}</td>

                <td className="action-buttons">
                  <EditButton onClick={() => handleEdit(item)} />
                  <DeleteButton onClick={() => handleDelete(item._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="user-pagination">
          <p>
            Showing {filteredAlterations.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredAlterations.length)}
            of {filteredAlterations.length} entries
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

export default Alteration;
