import { useEffect, useState } from "react";
import "./Alteration.css";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCustomers } from "../../features/Customer/customerSlice";
import SearchBox from "../../components/Common/SearchBox";
import {
  getAlterations,
  createAlteration,
  editAlteration,
  removeAlteration,
} from "../../features/Alteration/alterationSlice";

import { alterationValidation } from "../../validations/AlterationValidation";
import { fetchInvoices } from "../../features/Invoice/invoiceSlice";
import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
} from "../../components/Common/Button";

const Alteration = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customer);
  const { alterations } = useSelector((state) => state.alteration);
  const { invoices } = useSelector((state) => state.invoice);
  const [editId, setEditId] = useState(null);
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(alterationValidation),
  });
  const selectedCustomer = watch("customer");
  const filteredInvoices = invoices.filter(
    (invoice) => invoice.customer?._id === selectedCustomer,
  );

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

  const onSubmit = (data) => {
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

    reset();
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setShowForm(true);

    setValue("customer", item.customer?._id || item.customer || "");
    setValue("invoice", item.invoice?._id || item.invoice || "");
    setValue("productName", item.productName || "");
    setValue("alterationType", item.alterationType || "");
    setValue("alterationCharge", item.alterationCharge || 0);
    setValue(
      "expectedDeliveryDate",
      item.expectedDeliveryDate
        ? item.expectedDeliveryDate.substring(0, 10)
        : "",
    );
    setValue("status", item.status || "");
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
        <AddButton
          onClick={() => {
            reset();
            setEditId(null);
            setShowForm(true);
          }}
        >
          Add Alteration
        </AddButton>
      </div>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowForm(false);
            reset();
            setEditId(null);
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="alteration-form"
            onClick={(e) => e.stopPropagation()}
          >
            <select {...register("customer")}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>

            <select {...register("invoice")}>
              <option value="">Select Invoice</option>
              {filteredInvoices.map((invoice) => (
                <option key={invoice._id} value={invoice._id}>
                  {invoice.invoiceNo}
                </option>
              ))}
            </select>

            <input placeholder="Product Name" {...register("productName")} />
            <p>{errors.productName?.message}</p>

            <input
              placeholder="Alteration Type"
              {...register("alterationType")}
            />
            <p>{errors.alterationType?.message}</p>

            <input
              type="number"
              placeholder="Charge"
              {...register("alterationCharge")}
            />
            <p>{errors.alterationCharge?.message}</p>

            <input type="date" {...register("expectedDeliveryDate")} />
            <p>{errors.expectedDeliveryDate?.message}</p>

            <select {...register("status")}>
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>

            <p>{errors.status?.message}</p>

            <div className="form-buttons">
              <SaveButton type="submit" />

              <CancelButton
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setEditId(null);
                }}
              >
                Cancel
              </CancelButton>
            </div>
          </form>
        </div>
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
