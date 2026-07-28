import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
  const { salesReturns, isLoading } = useSelector((state) => state.salesReturn);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSalesReturns = salesReturns.slice(indexOfFirst, indexOfLast);
  const totalPages =
    salesReturns.length > 0 ? Math.ceil(salesReturns.length / itemsPerPage) : 1;

  const filteredSalesReturn = currentSalesReturns.filter((item) =>
    (item.productName || "").toLowerCase().includes(search.toLowerCase()),
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
    setEditId(item._id);

    reset({
      invoice: item.invoice || "",
      customer: item.customer || "",
      returnDate: item.returnDate ? item.returnDate.substring(0, 10) : "",
      refundAmount: item.refundAmount,
      reason: item.reason,
    });

    setShowForm(true);
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
    <div className="salesreturn-container">
      <div className="salesreturn-header">
        <h2>Sales Return Management</h2>
        <SearchBox
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
          Add Sales Return
        </AddButton>
      </div>

      <div className="salesreturn-table-wrapper">
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
      </div>
    </div>
  );
};

export default SalesReturn;
