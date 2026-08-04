import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../../components/common/Modal";
import {
  getSalesReturns,
  createSalesReturn,
  updateSalesReturn,
  deleteSalesReturn,
} from "../../features/salesReturn/salesReturnSlice";

import { salesReturnValidation } from "../../validations/SalesReturnValidation";
import SearchBox from "../../components/Common/SearchBox";
import "./SalesReturn.css";
import { fetchInvoices } from "../../features/Invoice/invoiceSlice";
import { getCustomers } from "../../features/Customer/customerSlice";
import {
  AddButton,
  EditButton,
  DeleteButton,
  PreviousButton,
  NextButton,
} from "../../components/Common/Button";
import SalesReturnForm from "./SalesReturnForm";

const SalesReturn = () => {
  const dispatch = useDispatch();
  const { customers = [] } = useSelector((state) => state.customer || {});
  const { invoices = [] } = useSelector((state) => state.invoice || {});
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [selectedSalesReturn, setSelectedSalesReturn] = useState(null);
  const { salesReturns, isLoading } = useSelector((state) => state.salesReturn);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentSalesReturns = salesReturns.slice(indexOfFirst, indexOfLast);
  const totalPages =
    salesReturns.length > 0 ? Math.ceil(salesReturns.length / rowsPerPage) : 1;

  const filteredSalesReturn = currentSalesReturns.filter((item) =>
    (item?.product?.productName || "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(salesReturnValidation),
    defaultValues: {
      invoice: "",
      customer: "",
      returnDate: new Date().toISOString().split("T")[0],
      refundAmount: "",
      reason: "",
    },
  });
  const selectedCustomer = watch("customer");
  const filteredInvoices = invoices.filter(
    (invoice) => invoice.customer?._id === selectedCustomer,
  );

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSalesReturns());
  }, [dispatch]);

  const onSubmit = (data) => {
    const payload = {
      invoice: data.invoice,
      customer: data.customer,
      returnDate: data.returnDate,
      refundAmount: Number(data.refundAmount),
      reason: data.reason,
    };

    if (editId) {
      dispatch(
        updateSalesReturn({
          id: editId,
          salesReturnData: payload,
        }),
      ).then(() => {
        dispatch(getSalesReturns());
        reset();
        setEditId(null);
        setShowForm(false);
      });
    } else {
      dispatch(createSalesReturn(payload)).then(() => {
        dispatch(getSalesReturns());
        reset();
        setShowForm(false);
      });
    }
  };

  const handleEdit = (item) => {
    setSelectedSalesReturn(item);
    setEditId(item._id);
    setMode("edit");
    // reset({
    //   invoice: item.invoice || "",
    //   customer: item.customer || "",
    //   returnDate: item.returnDate ? item.returnDate.substring(0, 10) : "",
    //   refundAmount: item.refundAmount,
    //   reason: item.reason,
    // });

    // setShowForm(true);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this Sales Return?")) {
      dispatch(deleteSalesReturn(id)).then(() => {
        dispatch(getSalesReturns());
      });
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Sales Returns</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setMode("add");
            setSelectedUser(null);
            setOpenModal(true);
          }}
        >
          + Add
        </button>

        {/* <SearchBox
          placeholder="Search sales..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            reset({
              invoice: "",
              customer: "",
              returnDate: new Date().toISOString().split("T")[0],
              refundAmount: "",
              reason: "",
            });

            setEditId(null);
            setShowForm(true);
          }}
        >
          + Add
        </AddButton> */}
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

          {/* <input
                  className="user-search-box"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                /> */}

          <SearchBox
            placeholder="Search sales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>SKU Code</th>
              <th>Quantity</th>
              <th>Refund Amount</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSalesReturn?.length > 0 ? (
              filteredSalesReturn.map((item) => (
                <tr key={item._id}>
                  <td>
                    {indexOfFirst + filteredSalesReturn.indexOf(item) + 1}
                  </td>
                  <td>{item.product?.productName || item.product || "-"}</td>

                  <td>{item.skuCode || "-"}</td>

                  <td>{item.quantity || "-"}</td>

                  <td>₹{item.refundAmount}</td>

                  <td>{item.reason}</td>

                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(item)} />

                    <DeleteButton onClick={() => handleDelete(item._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Sales Returns Found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="user-pagination">
          <p>
            Showing {filteredSalesReturn.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredSalesReturn.length)}
            of {filteredSalesReturn.length} entries
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

      <Modal
        open={openModal}
        title={mode === "add" ? "Add" : "Edit"}
        size="md"
        onClose={() => setOpenModal(false)}
      >
        <SalesReturnForm
          mode={mode}
          salesReturn={selectedSalesReturn}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            dispatch(getSalesReturns());
          }}
        />
      </Modal>

      {/* <div className="salesreturn-table-wrapper">
        <table className="salesreturn-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Return Date</th>
              <th>Refund Amount</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentSalesReturns?.length > 0 ? (
              currentSalesReturns.map((item) => (
                <tr key={item._id}>
                  <td>
                    {indexOfFirst + currentSalesReturns.indexOf(item) + 1}
                  </td>
                  <td>
                    {typeof item.invoice === "object"
                      ? item.invoice?.invoiceNumber || item.invoice?._id
                      : item.invoice}
                  </td>

                  <td>
                    {typeof item.customer === "object"
                      ? `${item.customer?.firstName || ""} ${
                          item.customer?.lastName || ""
                        }`
                      : item.customer}
                  </td>

                  <td>
                    {item.returnDate
                      ? new Date(item.returnDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>₹{item.refundAmount}</td>

                  <td>{item.reason}</td>

                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(item)} />

                    <DeleteButton onClick={() => handleDelete(item._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No Sales Returns Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SalesReturnForm
        showForm={showForm}
        setShowForm={setShowForm}
        customers={customers}
        filteredInvoices={filteredInvoices}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        reset={reset}
        setEditId={setEditId}
        editId={editId}
      />

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
      </div> */}
    </div>
  );
};

export default SalesReturn;
