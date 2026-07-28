import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auditLogValidation } from "../../validations/AuditLogValidation";
import {
  getAuditLogs,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog,
} from "../../features/auditLog/auditLogSlice";
import "./AuditLog.css";
import SearchBox from "../../components/Common/SearchBox";
import {
  AddButton,
  DeleteButton,
  PreviousButton,
  NextButton,
  EditButton,
} from "../../components/Common/Button";
import AuditLogForm from "./AuditLogForm";

const AuditLog = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { auditLogs, isLoading } = useSelector((state) => state.auditLogs);
  const loggedInUser = JSON.parse(
    localStorage.getItem("billing_user") || "null",
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAuditLogs = auditLogs.slice(indexOfFirst, indexOfLast);
  const totalPages =
    auditLogs.length > 0 ? Math.ceil(auditLogs.length / itemsPerPage) : 1;

  const [search, setSearch] = useState("");
  const filteredAuditLogs = currentAuditLogs.filter(
    (log) =>
      log.module?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId?.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(auditLogValidation),
  });

  useEffect(() => {
    if (loggedInUser) {
      setValue("user", `${loggedInUser.firstName} ${loggedInUser.lastName}`);
    }
  }, [loggedInUser, setValue]);

  useEffect(() => {
    dispatch(getAuditLogs());
  }, [dispatch]);

  const onSubmit = (data) => {
    let oldValue = {};
    let newValue = {};

    try {
      oldValue = data.oldValue ? JSON.parse(data.oldValue) : {};
      newValue = data.newValue ? JSON.parse(data.newValue) : {};
    } catch (err) {
      alert("Old Value and New Value must be valid JSON.");
      return;
    }

    const payload = {
      user: loggedInUser._id,
      module: data.module,
      action: data.action,
      recordId: data.referenceId || null,
      description: data.description,
      oldValues: oldValue,
      newValues: newValue,
      ipAddress: data.ipAddress,
    };

    if (editId) {
      dispatch(
        updateAuditLog({
          id: editId,
          ...payload,
        }),
      ).then(() => {
        dispatch(getAuditLogs());

        reset();

        if (loggedInUser) {
          setValue(
            "user",
            `${loggedInUser.firstName} ${loggedInUser.lastName}`,
          );
        }

        setShowForm(false);
        setEditId(null);
      });
    } else {
      dispatch(createAuditLog(payload)).then(() => {
        dispatch(getAuditLogs());

        reset();

        if (loggedInUser) {
          setValue(
            "user",
            `${loggedInUser.firstName} ${loggedInUser.lastName}`,
          );
        }

        setShowForm(false);
      });
    }
  };

  const handleEdit = (log) => {
    setEditId(log._id);

    reset({
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : "",
      module: log.module,
      action: log.action,
      referenceId: log.recordId || "",
      oldValue: JSON.stringify(log.oldValues || {}, null, 2),
      newValue: JSON.stringify(log.newValues || {}, null, 2),
      ipAddress: log.ipAddress,
      description: log.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this audit log?")) {
      dispatch(deleteAuditLog(id)).then(() => {
        dispatch(getAuditLogs());
      });
    }
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="auditlog-container">
      <div className="auditlog-header">
        <h2 className="auditlog-header">Audit Logs</h2>
      </div>
      <div className="auditlog-buttons">
        <SearchBox
          placeholder="Search Audit Logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            reset();
            if (loggedInUser) {
              setValue(
                "user",
                `${loggedInUser.firstName} ${loggedInUser.lastName}`,
              );
            }
            setEditId(null);
            setShowForm(true);
          }}
        >
          Add Audit Log
        </AddButton>
      </div>
      <div className="auditlog-table-wrapper">
        <table className="auditlog-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Module</th>
              <th>Action</th>
              <th>Reference Id</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>IP Address</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAuditLogs?.length > 0 ? (
              filteredAuditLogs.map((log) => (
                <tr key={log._id}>
                  <td>{indexOfFirst + filteredAuditLogs.indexOf(log) + 1}</td>
                  <td>
                    {log.user
                      ? `${log.user.firstName} ${log.user.lastName}`
                      : "-"}
                  </td>

                  <td>{log.module}</td>

                  <td>{log.action}</td>

                  <td>{log.recordId}</td>

                  <td>
                    {log.oldValues ? (
                      <div className="audit-data-card">
                        <div className="audit-row">
                          <span className="audit-label">Invoice : </span>
                          <span className="audit-value">
                            {log.oldValues.invoiceNo || "-"}
                          </span>
                        </div>

                        <div className="audit-row">
                          <span className="audit-label">Customer : </span>
                          <span className="audit-value">
                            {log.oldValues.customer || "-"}
                          </span>
                        </div>

                        <div className="audit-row">
                          <span className="audit-label">Grand Total : </span>
                          <span className="audit-value">
                            ₹{log.oldValues.grandTotal?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {log.newValues ? (
                      <div className="audit-data-card">
                        <div className="audit-row">
                          <span className="audit-label">Invoice : </span>
                          <span className="audit-value">
                            {log.newValues.invoiceNo || "-"}
                          </span>
                        </div>

                        <div className="audit-row">
                          <span className="audit-label">Customer : </span>
                          <span className="audit-value">
                            {log.newValues.customer || "-"}
                          </span>
                        </div>

                        <div className="audit-row">
                          <span className="audit-label">Grand Total : </span>
                          <span className="audit-value">
                            ₹{log.newValues.grandTotal?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{log.ipAddress}</td>

                  <td>
                    <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                    <div>{new Date(log.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="action-buttons">
                    <EditButton onClick={() => handleEdit(log)} />
                    <DeleteButton onClick={() => handleDelete(log._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No Audit Logs Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AuditLogForm
        showForm={showForm}
        setShowForm={setShowForm}
        editId={editId}
        setEditId={setEditId}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        reset={reset}
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

export default AuditLog;
