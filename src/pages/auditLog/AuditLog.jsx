import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Common/Modal";
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const itemsPerPage = rowsPerPage;
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [search, setSearch] = useState("");

  // Filter across the FULL list first, then paginate the filtered result.
  const filteredAuditLogs = auditLogs.filter(
    (log) =>
      log.module?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId?.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages =
    filteredAuditLogs.length > 0
      ? Math.ceil(filteredAuditLogs.length / itemsPerPage)
      : 1;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAuditLogs = filteredAuditLogs.slice(indexOfFirst, indexOfLast);

  // Keep currentPage valid whenever the filtered list or page size changes.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    dispatch(getAuditLogs());
  }, [dispatch]);

  const resetToFirstPage = () => setCurrentPage(1);

  const onSubmit = (data) => {
    if (!loggedInUser?._id) {
      alert("You must be logged in to perform this action.");
      return;
    }

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
        setShowForm(false);
        setEditId(null);
        setSelectedAuditLog(null);
      });
    } else {
      dispatch(createAuditLog(payload)).then(() => {
        dispatch(getAuditLogs());
        setShowForm(false);
        setSelectedAuditLog(null);
      });
    }
  };

  const handleEdit = (log) => {
    setEditId(log._id);
    setSelectedAuditLog(log);
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
    <div className="auditlog-page">
      <div className="auditlog-header">
        <h2 className="auditlog-header">Audit Logs</h2>

        <AddButton
          onClick={() => {
            setSelectedAuditLog(null);
            setEditId(null);
            setShowForm(true);
          }}
        >
          Add
        </AddButton>
      </div>
      <div className="auditlog-container">
        <div className="auditlog-table-wrapper">
          <div className="table-toolbar">
            <div className="entries">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  resetToFirstPage();
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
                placeholder="Search Audit Logs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetToFirstPage();
                }}
              />
            </div>
          </div>

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
              {currentAuditLogs?.length > 0 ? (
                currentAuditLogs.map((log, idx) => (
                  <tr key={log._id}>
                    <td>{indexOfFirst + idx + 1}</td>
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
                  <td colSpan="10">No Audit Logs Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          open={showForm}
          title={editId ? "Edit Audit Log" : "Add Audit Log"}
          onClose={() => setShowForm(false)}
        >
          <AuditLogForm
            mode={editId ? "edit" : "add"}
            auditLog={selectedAuditLog}
            loggedInUser={loggedInUser}
            onSubmit={onSubmit}
            onClose={() => setShowForm(false)}
          />
        </Modal>
        <div className="user-pagination">
          <p>
            Showing {filteredAuditLogs.length === 0 ? 0 : indexOfFirst + 1}
            to {Math.min(indexOfLast, filteredAuditLogs.length)}
            of {filteredAuditLogs.length} entries
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

export default AuditLog;
