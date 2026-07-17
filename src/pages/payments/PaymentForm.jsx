import "./PaymentForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {SaveButton} from "../../components/common/Button";

import { paymentValidation } from "../../validations/PaymentValidation";
import { createPayment, updatePayment } from "../../features/payment/paymentSlice";

import toaster from "../../utils/toaster";

import { useEffect, useMemo } from "react";

export default function PaymentForm({ mode = "add", payment = null, onClose, onSuccess, customers, suppliers, invoices, purchases }) {

    const dispatch = useDispatch();
    const {

        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(paymentValidation(mode)),

    });

    
const paymentType = watch("type");
const selectedCustomer = watch("customer");
const selectedSupplier = watch("supplier");
    useEffect(() => {
        console.log("Payment Type:", paymentType);
        console.log("Selected Customer:", selectedCustomer);
        console.log("Selected Supplier:", selectedSupplier);
        if (mode === "edit" && payment) {
            reset({
                type: payment.type,
                customer: payment.customer?._id,
                supplier: payment.supplier?._id,
                invoice: payment.invoice?._id,
                purchase: payment.purchase?._id,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentDate: payment.paymentDate?.split("T")[0] || "",
                remarks: payment.remarks,
                paymentStatus: payment.paymentStatus,
            });
        
        } else {
            reset({
                type: "",
                customer: "",
                supplier: "",
                invoice: "",
                purchase: "",
                amount: "",
                paymentMethod: "",
                paymentDate: "",
                remarks: "",
                paymentStatus: ""
            });
        }
    }, [mode, payment, reset]);

    const filteredInvoices = useMemo(() => {
  if (!selectedCustomer) return [];

  return invoices.filter(
    (invoice) => invoice.customer?._id === selectedCustomer
  );
}, [selectedCustomer, invoices]);

    const filteredPurchases = useMemo(() => {
  if (!selectedSupplier) return [];

  return purchases.filter(
    (purchase) => purchase.supplier?._id === selectedSupplier
  );
}, [selectedSupplier, purchases]);

    
// const onSubmit = async (data) => {
//   let result;
// console.log("onSubmit data:", data);
//   if (mode === "add") {
//     result = await dispatch(createPayment(data));

//     toaster.success("Payment created successfully!");
//   } else {
//     result = await dispatch(
//       updatePayment({
//         id: payment._id,
//         data,
//       })
//     );
//     toaster.success("Payment updated successfully!");
//   }

//   if (
//     createPayment.fulfilled.match(result) ||
//     updatePayment.fulfilled.match(result)
//   ) {
//     onSuccess();
//   }
// };

const onSubmit = async (data) => {
  let result;

  if (mode === "add") {
    result = await dispatch(createPayment(data));

    if (createPayment.fulfilled.match(result)) {
      toaster.success("Payment created successfully!");
      onSuccess();
    } else {
      toaster.error(
        result.payload?.message ||
        result.error?.message ||
        "Failed to create payment."
      );
    }
  } else {
    result = await dispatch(
      updatePayment({
        id: payment._id,
        data,
      })
    );

    if (updatePayment.fulfilled.match(result)) {
      toaster.success("Payment updated successfully!");
      onSuccess();
    } else {
      toaster.error(
        result.payload?.message ||
        result.error?.message ||
        "Failed to update payment."
      );
    }
  }
};

const onValidationError = (errors) => {
  const firstError = Object.values(errors)[0];

  if (firstError?.message) {
    toaster.error(firstError.message);
  }
};


console.log("payment_errors", errors);
console.log("paymentform",  paymentType,  selectedCustomer, suppliers, invoices, purchases);
    return(

        <form onSubmit={handleSubmit(onSubmit, onValidationError)} className="user-form">

            <div className="form-grid">

                <Select
                    label="Payment Type"
                    name="type"
                    register={register}
                    error={errors.type?.message}
                    options={[
                        { _id: "sale", label: "Sale" },
                        { _id: "purchase", label: "Purchase" },
                        { _id: "refund", label: "Refund" },
                    ]}
                />

                {(paymentType === "sale" || paymentType === "refund") && (
                    <>
                        <Select
                            label="Customer"
                            name="customer"
                            register={register}
                            error={errors.customer?.message}
                            options={customers.map((customer) => ({
                                _id: customer._id,
                                label: customer.customerName,
                            }))}
                        />
                        <Select
                            label="Invoice"
                            name="invoice"
                            register={register}
                            error={errors.invoice?.message}
                            options={filteredInvoices.map((invoice) => ({
                                _id: invoice._id,
                                label: invoice.invoiceNo
                            }))}
                        />
                    </>
                )}

                {paymentType === "purchase" && (
                    <>
                        <Select
                            label="Supplier"
                            name="supplier"
                            register={register}
                            error={errors.supplier?.message}
                            options={suppliers.map((supplier) => ({
                                _id: supplier._id,
                                label: supplier.supplierName,
                            }))}
                        />
                        <Select
                            label="Purchase"
                            name="purchase"
                            register={register}
                            error={errors.purchase?.message}
                            options={filteredPurchases.map((purchase) => ({
                                _id: purchase._id,
                                label: purchase.purchaseNo
                            }))}
                        />
                    </>
                )}


            </div>

            <div className="form-grid">

               {/* //amount input filds */}
               <Input 
                    label="Amount"
                    name="amount"
                    type="number"
                    register={register}
                    error={errors.amount?.message}
                />

                <Select
                    label="Payment Method"
                    name="paymentMethod"
                    register={register}
                    error={errors.paymentMethod?.message}
                    options={[
                        { _id: "cash", label: "Cash" },
                        { _id: "upi", label: "UPI" },
                        { _id: "card", label: "Card" },
                        { _id: "wallet", label: "Wallet" },
                        { _id: "net_banking", label: "Bank Transfer" },
                        { _id: "cheque", label: "Cheque" },
                    ]}
                />

            </div>

            <div className="form-grid">

                {/* //payment date input filds */}
                <Input 
                    label="Payment Date"
                    name="paymentDate"
                    type="date"
                    register={register}
                    error={errors.paymentDate?.message}
                />

                {/* //payment status select filds */}
                <Select
                    label="Payment Status"
                    name="paymentStatus"
                    register={register}
                    error={errors.paymentStatus?.message}
                    options={[
                        { _id: "pending", label: "Pending" },
                        { _id: "completed", label: "Completed" },
                        { _id: "failed", label: "Failed" },
                    ]}
                />

            </div>

            <div className="form-grid">

                {/* //remarks input filds */}
                <Input 
                    label="Remarks"
                    name="remarks"
                    type="text"
                    register={register}
                    error={errors.remarks?.message}
                />

            </div>

            <div className="form-footer">
                <SaveButton>
                    {mode === "add" ? "Add Payment" : "Update Payment"}
                </SaveButton>
            </div>

        </form>

    );

}