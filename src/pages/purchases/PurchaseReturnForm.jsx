import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { SaveButton, CancelButton } from "../../components/Common/Button";

const PurchaseReturnForm = ({
  item,
  editId,
  purchaseOptions,
  supplierOptions,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (item) {
      setValue("returnNo", item.returnNo);
      setValue("purchase", item.purchase ? item.purchase._id : "");
      setValue("supplier", item.supplier ? item.supplier._id : "");
      setValue(
        "returnDate",
        item.returnDate ? item.returnDate.substring(0, 10) : "",
      );
      setValue("refundAmount", item.refundAmount);
      setValue("reason", item.reason);
    } else {
      reset();
    }
  }, [item, reset, setValue]);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div
        className="purchase-return-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{editId ? "Edit Purchase Return" : "Add Purchase Return"}</h3>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="form-grid">
            <Input
              label="Return No"
              name="returnNo"
              register={register}
              error={errors.returnNo}
              validation={{
                required: "Return No is required",
              }}
            />

            <Select
              label="Purchase"
              name="purchase"
              register={register}
              error={errors.purchase}
              options={purchaseOptions}
              validation={{
                required: "Purchase is required",
              }}
            />

            <Select
              label="Supplier"
              name="supplier"
              register={register}
              error={errors.supplier}
              options={supplierOptions}
              validation={{
                required: "Supplier is required",
              }}
            />

            <Input
              type="date"
              label="Return Date"
              name="returnDate"
              register={register}
              error={errors.returnDate}
              validation={{
                required: "Return Date is required",
              }}
            />

            <Input
              type="number"
              label="Refund Amount"
              name="refundAmount"
              register={register}
              error={errors.refundAmount}
              validation={{
                required: "Refund Amount is required",
              }}
            />

            <Input
              label="Reason"
              name="reason"
              register={register}
              error={errors.reason}
              validation={{
                required: "Reason is required",
              }}
            />
          </div>

          <div className="modal-buttons">
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>

            <SaveButton type="submit">{editId ? "Update" : "Save"}</SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseReturnForm;
