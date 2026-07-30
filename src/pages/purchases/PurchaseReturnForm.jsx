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
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Input
          label="Return No"
          name="returnNo"
          register={register}
          error={errors.returnNo}
        />

        <Select
          label="Purchase"
          name="purchase"
          register={register}
          error={errors.purchase}
          options={purchaseOptions}
        />

        <Select
          label="Supplier"
          name="supplier"
          register={register}
          error={errors.supplier}
          options={supplierOptions}
        />

        <Input
          type="date"
          label="Return Date"
          name="returnDate"
          register={register}
          error={errors.returnDate}
        />

        <Input
          type="number"
          label="Refund Amount"
          name="refundAmount"
          register={register}
          error={errors.refundAmount}
        />

        <Input
          label="Reason"
          name="reason"
          register={register}
          error={errors.reason}
        />
      </div>

      <div className="form-buttons">
        <SaveButton type="submit">{editId ? "Update" : "Save"}</SaveButton>

        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default PurchaseReturnForm;
