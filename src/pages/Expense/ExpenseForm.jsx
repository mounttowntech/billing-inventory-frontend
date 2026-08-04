import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Select from "../../components/Common/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { expenseValidation } from "../../validations/ExpenseValidation";
import { useEffect } from "react";

const ExpenseForm = ({ mode, expense, onSubmit, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseValidation),
  });

  useEffect(() => {
    if (expense) {
      reset({
        expenseNo: expense.expenseNo || "",
        title: expense.title || "",
        category: expense.category || "",
        amount: expense.amount || "",
        expenseDate: expense.expenseDate
          ? expense.expenseDate.split("T")[0]
          : "",
        note: expense.note || "",
      });
    } else {
      reset({
        expenseNo: "",
        title: "",
        category: "",
        amount: "",
        expenseDate: "",
        note: "",
      });
    }
  }, [expense, reset]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="expense-form">
      <Input
        label="Expense No"
        name="expenseNo"
        type="number"
        placeholder="Enter Expense No"
        register={register}
        error={errors.expenseNo?.message}
      />

      <Input
        label="Title"
        name="title"
        placeholder="Enter Title"
        register={register}
        error={errors.title?.message}
      />

      <Select
        label="Category"
        name="category"
        register={register}
        error={errors.category?.message}
        options={[
          { _id: "rent", label: "Rent" },
          { _id: "salary", label: "Salary" },
          { _id: "electricity", label: "Electricity" },
          { _id: "marketing", label: "Marketing" },
          { _id: "transport", label: "Transport" },
          { _id: "miscellaneous", label: "Miscellaneous" },
        ]}
      />

      <Input
        label="Amount"
        name="amount"
        type="number"
        placeholder="Enter Amount"
        register={register}
        error={errors.amount?.message}
      />

      <Input
        label="Expense Date"
        name="expenseDate"
        type="date"
        register={register}
        error={errors.expenseDate?.message}
      />

      <Input
        label="Note"
        name="note"
        type="textarea"
        placeholder="Enter Note"
        register={register}
        error={errors.note?.message}
      />
      <div className="form-buttons">
        <SaveButton type="submit">
          {mode === "edit" ? "Update " : "Save "}
        </SaveButton>
        <CancelButton
          type="button"
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

export default ExpenseForm;
