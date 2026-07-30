import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { invoiceValidation } from "../../validations/InvoiceValidation";
import { getCustomers } from "../../features/customer/customerSlice";
import { getProducts } from "../../features/product/productSlice";
import {
  fetchInvoices,
  updateInvoice,
  createInvoice,
  deleteInvoice,
} from "../../features/Invoice/invoiceSlice";
import "./Invoice.css";
import Modal from "../../components/Common/Modal";

import {
  AddButton,
  PreviousButton,
  NextButton,
  EditButton,
  DeleteButton,
} from "../../components/Common/Button";
import SearchBox from "../../components/Common/SearchBox";
import InvoiceForm from "./InvoiceForm";

const Invoice = () => {
  const dispatch = useDispatch();

  const { invoices, loading } = useSelector((state) => state.invoice);
  const { customers } = useSelector((state) => state.customer);
  const { products } = useSelector((state) => state.product);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemsPerPage = rowsPerPage;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentInvoices = invoices.slice(indexOfFirst, indexOfLast);

  const filteredInvoices = currentInvoices.filter((invoice) =>
    (invoice.invoiceNo || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages =
    filteredInvoices.length > 0 ? Math.ceil(invoices.length / itemsPerPage) : 1;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(invoiceValidation),
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(getCustomers());
    dispatch(getProducts());
  }, [dispatch]);

  const selectedProductId = watch("product");

  const selectedProduct = products.find(
    (product) => product._id === selectedProductId,
  );

  const onSubmit = async (data) => {
    const invoiceData = {
      customer: data.customer,
      discountAmount: Number(data.discountAmount || 0),
      paidAmount: Number(data.paidAmount || 0),
      paymentMethod: data.paymentMethod,
      remarks: data.remarks,
      items: [
        {
          product: data.product,
          skuCode: data.skuCode,
          quantity: Number(data.quantity),
        },
      ],
    };

    let result;

    if (editingId) {
      result = await dispatch(
        updateInvoice({
          id: editingId,
          invoice: invoiceData,
        }),
      );
    } else {
      result = await dispatch(createInvoice(invoiceData));
    }

    if (!result.error) {
      reset();
      setEditingId(null);
      setShowModal(false);
      dispatch(fetchInvoices());
    }
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice._id);

    reset({
      customer: invoice.customer?._id || "",
      product: invoice.items?.[0]?.product || "",
      skuCode: invoice.items?.[0]?.skuCode || "",
      quantity: invoice.items?.[0]?.quantity || "",
      discountAmount: invoice.discountAmount || 0,
      paidAmount: invoice.paidAmount || 0,
      paymentMethod: invoice.paymentMethod || "",
      remarks: invoice.remarks || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this invoice?")) {
      await dispatch(deleteInvoice(id));
      dispatch(fetchInvoices());
    }
  };
  return (
    <div className="invoice-main">
      <div className="invoice-header">
        <h2>Invoice Management</h2>

        <AddButton onClick={() => setShowModal(true)}>+ Add Invoice</AddButton>
      </div>

      <div className="invoice-container">
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
              placeholder="Search Invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? "Edit Invoice" : "Add Invoice"}
        >
          <InvoiceForm
            showModal={showModal}
            setShowModal={setShowModal}
            customers={customers}
            products={products}
            selectedProduct={selectedProduct}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            editingId={editingId}
            onCancel={() => setShowModal(false)}
          />
        </Modal>

        <div className="table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>#</th>
                <th className="supplier-column">Invoice No</th>
                <th className="supplier-column-sku">SKU Code</th>
                <th className="supplier-column">Product Name</th>
                <th>Date</th>
                <th>Sub Total</th>
                <th>GST</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="supplier-column">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    No Invoices Found
                  </td>
                </tr>
              ) : (
                currentInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>
                      {indexOfFirst + currentInvoices.indexOf(invoice) + 1}
                    </td>
                    <td>{invoice.invoiceNo}</td>

                    <td className="supplier-column-sku">
                      {invoice.items?.map((item) => (
                        <div key={item.skuCode}>{item.skuCode}</div>
                      ))}
                    </td>

                    <td className="supplier-column">
                      {invoice.items?.map((item) => (
                        <div key={item.skuCode}>{item.productName}</div>
                      ))}
                    </td>

                    <td>
                      {invoice.invoiceDate
                        ? invoice.invoiceDate.split("T")[0]
                        : ""}
                    </td>

                    <td>₹{invoice.subTotal}</td>

                    <td>₹{invoice.gstAmount}</td>

                    <td>₹{invoice.grandTotal}</td>

                    <td>₹{invoice.paidAmount}</td>

                    <td>₹{invoice.dueAmount}</td>

                    <td>{invoice.paymentMethod}</td>

                    <td>{invoice.paymentStatus}</td>

                    <td className="supplier-column">
                      <EditButton onClick={() => handleEdit(invoice)}>
                        Edit
                      </EditButton>

                      <DeleteButton onClick={() => handleDelete(invoice._id)}>
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
            Showing {filteredInvoices.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredInvoices.length)}
            of {filteredInvoices.length} entries
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

export default Invoice;
