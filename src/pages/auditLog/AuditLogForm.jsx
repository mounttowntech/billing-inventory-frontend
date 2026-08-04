import { SaveButton, CancelButton } from "../../components/Common/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auditLogValidation } from "../../validations/AuditLogValidation";
import Input from "../../components/Common/Input";
import { useEffect } from "react";

const AuditLogForm = ({ mode, auditLog, loggedInUser, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(auditLogValidation),
  });

  const currentUserName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "Unknown User";

  useEffect(() => {
    if (auditLog) {
      reset({
        user: auditLog.user
          ? `${auditLog.user.firstName} ${auditLog.user.lastName}`
          : currentUserName,
        module: auditLog.module || "",
        action: auditLog.action || "",
        description: auditLog.description || "",
        referenceId: auditLog.recordId || "",
        oldValue: JSON.stringify(auditLog.oldValues || {}, null, 2),
        newValue: JSON.stringify(auditLog.newValues || {}, null, 2),
        ipAddress: auditLog.ipAddress || "",
      });
    } else {
      reset({
        user: currentUserName,
        module: "",
        action: "",
        description: "",
        referenceId: "",
        oldValue: "",
        newValue: "",
        ipAddress: "",
      });

      setValue("user", currentUserName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLog, currentUserName, reset, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <Input
          label="User"
          name="user"
          placeholder="User"
          disabled
          register={register}
          error={errors.user?.message}
        />
        <Input
          label="Description"
          name="description"
          type="textarea"
          placeholder="Enter Description"
          register={register}
          error={errors.description?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Module"
          name="module"
          placeholder="Enter Module"
          register={register}
          error={errors.module?.message}
        />
        <Input
          label="Action"
          name="action"
          placeholder="Enter Action"
          register={register}
          error={errors.action?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Reference Id"
          name="referenceId"
          placeholder="Enter Reference Id"
          register={register}
          error={errors.referenceId?.message}
        />
        <Input
          label="Old Value (JSON)"
          name="oldValue"
          type="textarea"
          placeholder="Enter Old Value"
          register={register}
          error={errors.oldValue?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="New Value (JSON)"
          name="newValue"
          type="textarea"
          placeholder="Enter New Value"
          register={register}
          error={errors.newValue?.message}
        />

        <Input
          label="IP Address"
          name="ipAddress"
          placeholder="Enter IP Address"
          register={register}
          error={errors.ipAddress?.message}
        />
      </div>
      <div className="audit-form-buttons">
        <SaveButton type="submit">
          {mode === "edit" ? "Update Audit Log" : "Add Audit Log"}
        </SaveButton>

        <CancelButton
          onClick={() => {
            reset();
            onClose();
          }}
        >
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default AuditLogForm;
