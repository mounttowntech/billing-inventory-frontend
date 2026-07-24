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

import { fetchInvoices } from "../../features/Invoice/invoiceSlice";
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

  const itemsPerPage = 3;

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
      });
    } else {
      dispatch(createAlteration(data)).then(() => {
        dispatch(getAlterations());
      });
    }

    setEditId(null);
    setEditingAlteration(null);
    setShowForm(false);
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
    <div className="alteration-container">
      <div className="page-header">
        <h2>Alteration Management</h2>
      </div>
      <div className="alteration-actions">
        <SearchBox
          placeholder="Search alterations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={handleAdd}>Add Alteration</AddButton>
      </div>

      {showForm && (
        <AlterationForm
          alteration={editingAlteration}
          editId={editId}
          customers={customers}
          invoices={invoices}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

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
      <div className="pagination">
        <PreviousButton
          className="btn btn-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </PreviousButton>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <NextButton
          className="btn btn-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </NextButton>
      </div>
    </div>
  );
};

export default Alteration;
