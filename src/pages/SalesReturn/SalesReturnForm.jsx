import { SaveButton, CancelButton } from "../../components/Common/Button";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesReturnValidation } from "../../validations/salesReturnValidation";
import { getSalesReturns } from "../../features/salesReturn/salesReturnSlice";
import toaster from "../../utils/toaster";

import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import { createSalesReturn, updateSalesReturn } from "../../features/salesReturn/salesReturnSlice";
import { useEffect } from "react";

import {getProducts} from "../../features/Product/productSlice";

/**
 * Modal form for creating / editing a Sales Return.
 * All state (react-hook-form, customers, invoices, etc.) is owned by the
 * parent <SalesReturn /> component and passed down as props.
 */
const SalesReturnForm = ({ mode = "add", salesReturn = null, onClose, onSuccess }) => {
  // if (!showForm) return null;

  const dispatch = useDispatch();
  
    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(salesReturnValidation(mode)),
    });
    const { products } = useSelector((state) => state.product);
console.log("Products:", products);
    useEffect(() => {
        // dispatch(getCustomers());
        dispatch(getProducts());
      }, [dispatch]);

      //get selected product sku codes
      const selectedProduct = watch("product");
      const filteredProduct = products.find((product) => product._id === selectedProduct);
      const skuCodes = filteredProduct?.variants?.map((variant) => variant.skuCode) || [];

      
console.log("Selected Product:", selectedProduct);
console.log("Filtered Product:", filteredProduct);
console.log("SKU Codes:", skuCodes);

    const onSubmit = (data) => {
      console.log("Sales Return Form Data:", data);
      try {
        const payload = {
          invoice: data.invoice,
          customer: data.customer,
          returnDate: data.returnDate,
          returnAmount: Number(data.returnAmount),
          reason: data.reason,
        };
    
        if (mode === "edit" && salesReturn) {
          dispatch(
            updateSalesReturn({
              id: salesReturn._id,
              salesReturnData: payload,
            }),
          ).then((res) => {
            console.log("Sales Return updated:", res);
            onSuccess(); // Call the onSuccess callback to refresh the list in the parent component
            // dispatch(getSalesReturns());
            // reset();
            // setEditId(null);
            // setShowForm(false);
          }).catch((error) => {
            console.log("Error updating Sales Return:", error);
            toaster.error("Failed to update Sales Return. Please try again.");
          });
        } else {
          dispatch(createSalesReturn(payload)).then((res) => {
            console.log("Sales Return created:", res);
            onSuccess(); // Call the onSuccess callback to refresh the list in the parent component
            // dispatch(getSalesReturns());
            // reset();
            // setShowForm(false);
          }).catch((error) => {
            console.log("Error creating Sales Return:", error);
            toaster.error("Failed to create Sales Return. Please try again.");
          });
        }
      } catch (error) {
        console.log("Error submitting Sales Return form:", error);
      }
    };


console.log("Sales Return Form Errors:", errors);
  return (
        <form onSubmit={handleSubmit(onSubmit)} className="user-form">

      <div className="form-grid">
        <Select
          label="Product"
          name="product"
          register={register}
          error={errors.product?.message}
          options={[
            ...products.map((product) => ({
              _id: product._id,
              label: product.productName,
            })),
          ]}
        />

        <Select
          label="SKU Code"
          name="skuCode"
          register={register}
          error={errors.skuCode?.message}
          options={[
            ...(skuCodes.map((skuCode) => ({
              _id: skuCode,
              label: skuCode,
            })) || []),
          ]}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          register={register}
          error={errors.quantity?.message}
        />
        <Input
          label="Return Amount"
          name="returnAmount"
          type="number"
          register={register}
          error={errors.returnAmount?.message}
        />
        </div>
        <div className="form-grid">
          {/* //reason */}
          <textarea
            label="Reason"
            name="reason"
            {...register("reason")}
            error={errors.reason?.message}
          />
          </div>

      <div className="form-footer">
        <SaveButton>{mode === "add" ? "Add User" : "Update User"}</SaveButton>
        <CancelButton
          type="button"
          onClick={() => {
            reset();
            setEditId(null);
            setShowForm(false);
          }}
        >
          Cancel
        </CancelButton>
      </div>

          {/* <div className="salesreturn-form-group">
            <label>Customer</label>
            <select {...register("customer")}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
            <p>{errors.customer?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Invoice</label>
            <select {...register("invoice")}>
              <option value="">Select Invoice</option>
              {filteredInvoices.map((invoice) => (
                <option key={invoice._id} value={invoice._id}>
                  {invoice.invoiceNumber || invoice.invoiceNo}
                </option>
              ))}
            </select>
            <p>{errors.invoice?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Return Date</label>

            <input type="date" {...register("returnDate")} />

            <p>{errors.returnDate?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Refund Amount</label>

            <input type="number" {...register("refundAmount")} />

            <p>{errors.refundAmount?.message}</p>
          </div>

          <div className="salesreturn-form-group">
            <label>Reason</label>

            <textarea rows="4" {...register("reason")} />

            <p>{errors.reason?.message}</p>
          </div>

          <div className="salesreturn-form-buttons">
            <SaveButton type="submit">
              {editId ? "Update Sales Return" : "Add Sales Return"}
            </SaveButton>

            <CancelButton
              type="button"
              onClick={() => {
                reset();
                setEditId(null);
                setShowForm(false);
              }}
            >
              Cancel
            </CancelButton>
          </div> */}
        </form>
  );
};

export default SalesReturnForm;
