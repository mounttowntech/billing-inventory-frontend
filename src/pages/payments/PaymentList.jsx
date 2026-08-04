import "./PaymentList.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/common/Modal";
import PaymentForm from "../payments/PaymentForm";
import {
  getPayments,
  deletePayment,
} from "../../features/payment/paymentSlice";
import toaster from "../../utils/toaster";
import { getCustomers } from "../../features/Customer/customerSlice";
import { getSuppliers } from "../../features/Supplier/supplierSlice";
import { fetchInvoices } from "../../features/Invoice/invoiceSlice";
import { getPurchases } from "../../features/Purchase/purchaseSlice";

export default function PaymentList() {
  const dispatch = useDispatch();
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [mode, setMode] = useState("add"); // add | edit
  const { payments: authPayments } = useSelector((state) => state.payment);
  const { customers } = useSelector((state) => state.customer);
  const { suppliers } = useSelector((state) => state.supplier);
  const { invoices } = useSelector((state) => state.invoice);
  const { purchases } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(getPayments());
    dispatch(getCustomers());
    dispatch(getSuppliers());
    dispatch(fetchInvoices());
    dispatch(getPurchases());
  }, [dispatch]);

  useEffect(() => {
    console.log("data has been loaded in console: ", authPayments);
    if (authPayments) {
      setPayments(authPayments);
    }
  }, [authPayments]);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const filteredPayments = payments.filter((payment) =>
    `${payment.paymentNo} ${payment.type} ${payment?.customerName || ""} ${payment.supplier?.supplierName || ""} ${payment.amount} ${payment.paymentMethod} ${convertDate(payment.paymentDate)} ${payment.paymentStatus}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const indexOfLastPayment = currentPage * rowsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - rowsPerPage;

  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  // console.log(payments);

  const handleDelete = async (payment) => {
    const ok = window.confirm(`Delete ${payment.paymentNo}?`);

    if (!ok) return;

    await dispatch(deletePayment(payment._id));
    toaster.success("Payment deleted successfully!");
    dispatch(getPayments());
  };

  console.log("customers", customers);
  console.log("suppliers", suppliers);
  console.log("invoices", invoices);
  console.log("purchases", purchases);
  console.log("cuurrentPayments", currentPayments);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Payment Lists</h2>

        <button
          className="btn-primary"
          onClick={() => {
            setMode("add");
            setSelectedPayment(null);
            setOpenModal(true);
          }}
        >
          + Add
        </button>
      </div>

      <div className="table-card">
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

          <input
            className="user-search-box"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment No</th>
              <th>Payment Type</th>
              <th>Customer/Supplier</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Payment Date</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No payments found.
                </td>
              </tr>
            ) : (
              currentPayments?.map((payment, index) => (
                <tr key={payment?._id ?? index}>
                  <td>{indexOfFirstPayment + index + 1}</td>

                  <td>{payment?.paymentNo}</td>

                  <td>{payment?.type}</td>

                  <td>
                    {payment?.supplier?.supplierName
                      ? payment.supplier.supplierName
                      : payment?.customer?.customerName
                        ? payment.customer.customerName
                        : payment?.customerName
                          ? payment.customerName
                          : "-"}
                  </td>

                  <td>{payment?.amount}</td>

                  <td>{payment?.paymentMethod}</td>

                  <td>{convertDate(payment?.paymentDate)}</td>

                  <td>
                    {payment?.paymentStatus === "pending" ? (
                      <span className="status pending">Pending</span>
                    ) : payment?.paymentStatus === "completed" ? (
                      <span className="status active">
                        {payment?.paymentStatus ? "Completed" : "-"}
                      </span>
                    ) : null}
                  </td>

                  <td>
                    <div className="action-column">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setMode("edit");
                          setSelectedPayment(payment);
                          setOpenModal(true);
                        }}
                        disabled={payment?.paymentMethod === "cashfree"}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(payment)}
                        disabled={payment?.paymentMethod === "cashfree"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="user-pagination">
        <p>
          Showing {filteredPayments.length === 0 ? 0 : indexOfFirstPayment + 1}
          to {Math.min(indexOfLastPayment, filteredPayments.length)}
          of {filteredPayments.length} entries
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
      <Modal
        open={openModal}
        title={mode === "add" ? "Add Payment" : "Edit Payment"}
        size="md"
        onClose={() => setOpenModal(false)}
      >
        <PaymentForm
          mode={mode}
          payment={selectedPayment}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            dispatch(getPayments());
          }}
          customers={customers}
          suppliers={suppliers}
          invoices={invoices}
          purchases={purchases}
        />
      </Modal>
    </div>
  );
}
