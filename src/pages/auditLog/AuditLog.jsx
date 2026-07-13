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
import {
  AddButton,
  DeleteButton,
  EditButton,
  CancelButton,
  SaveButton,
} from "../../components/Common/Button";
const AuditLog = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { auditLogs, isLoading } = useSelector((state) => state.auditLogs);
  const loggedInUser = JSON.parse(
    localStorage.getItem("billing_user") || "null",
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

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  console.log("Logged In User:", loggedInUser);
  console.log(localStorage);

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

    console.log("Payload:", payload);

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
    console.log("The log is:", log);
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

  return (
    <div className="auditlog-container">
      <h2 className="auditlog-header">Audit Logs</h2>
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
      </AddButton>{" "}
      <table className="auditlog-table">
        <thead>
          <tr>
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
          {auditLogs?.length > 0 ? (
            auditLogs.map((log) => (
              <tr key={log._id}>
                <td>
                  {log.user
                    ? `${log.user.firstName} ${log.user.lastName}`
                    : "-"}
                </td>

                <td>{log.module}</td>

                <td>{log.action}</td>

                <td>{log.recordId}</td>

                <td>
                  <pre>{JSON.stringify(log.oldValues, null, 2)}</pre>
                </td>

                <td>
                  {log.newValues ? (
                    <div className="audit-data-card">
                      <div className="audit-row">
                        <span className="audit-label">Invoice</span>
                        <span className="audit-value">
                          {log.newValues.invoiceNo || "-"}
                        </span>
                      </div>

                      <div className="audit-row">
                        <span className="audit-label">Customer</span>
                        <span className="audit-value">
                          {log.newValues.customer || "-"}
                        </span>
                      </div>

                      <div className="audit-row">
                        <span className="audit-label">Grand Total</span>
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

                <td>{new Date(log.createdAt).toLocaleString()}</td>
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
      {showForm && (
        <div className="modal-overlay">
          <div className="audit-modal">
            <div className="audit-modal-header">
              <h3>Add Audit Log</h3>

              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="audit-form-group">
                <label>User</label>
                <input type="text" {...register("user")} disabled />
                <p>{errors.user?.message}</p>
              </div>

              <div className="audit-form-group">
                <label>Description</label>
                <textarea rows="3" {...register("description")} />
                <p>{errors.description?.message}</p>
              </div>

              <div className="audit-form-group">
                <label>Module</label>
                <input type="text" {...register("module")} />
                <p>{errors.module?.message}</p>
              </div>

              <div className="audit-form-group">
                <label>Action</label>
                <input type="text" {...register("action")} />
                <p>{errors.action?.message}</p>
              </div>

              <div className="audit-form-group">
                <label>Reference Id</label>
                <input type="text" {...register("referenceId")} />
              </div>

              <div className="audit-form-group">
                <label>Old Value (JSON)</label>
                <textarea rows="4" {...register("oldValue")} />
              </div>

              <div className="audit-form-group">
                <label>New Value (JSON)</label>
                <textarea rows="4" {...register("newValue")} />
              </div>

              <div className="audit-form-group">
                <label>IP Address</label>
                <input type="text" {...register("ipAddress")} />
              </div>

              <div className="audit-form-buttons">
                <SaveButton type="submit">
                  {editId ? "Update Audit Log" : "Add Audit Log"}
                </SaveButton>

                <CancelButton
                  onClick={() => {
                    reset();
                    setEditId(null);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </CancelButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
