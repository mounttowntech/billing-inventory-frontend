import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PurchaseValidation from "../../validations/PurchaseValidation";
import { SaveButton, CancelButton } from "../../components/Common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

const PurchaseForm = ({
  purchase,
  editId,
  suppliers,
  products,
  onSubmit,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PurchaseValidation),
    defaultValues: {
      supplier: "",
      product: "",
      skuCode: "",
      quantity: "",
      purchasePrice: "",
      gstAmount: "",
      totalAmount: "",
      paidAmount: "",
    },
  });

  const selectedProductId = watch("product");
  const selectedProduct = products.find(
    (product) => product._id === selectedProductId,
  );

  // Populate form when editing, reset when adding
  useEffect(() => {
    if (purchase) {
      reset({
        supplier: purchase.supplier?._id || "",
        product: purchase.items?.[0]?.product || "",
        skuCode: purchase.items?.[0]?.skuCode || "",
        quantity: purchase.items?.[0]?.quantity || "",
        purchasePrice: purchase.items?.[0]?.purchasePrice || "",
        gstAmount: purchase.items?.[0]?.gstAmount || "",
        totalAmount: purchase.items?.[0]?.totalAmount || "",
        paidAmount: purchase.paidAmount || "",
      });
    } else {
      reset({
        supplier: "",
        product: "",
        skuCode: "",
        quantity: "",
        purchasePrice: "",
        gstAmount: "",
        totalAmount: "",
        paidAmount: "",
      });
    }
  }, [purchase, reset]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data) => {
    const purchaseData = {
      supplier: data.supplier,
      paidAmount: Number(data.paidAmount),
      items: [
        {
          product: data.product,
          skuCode: data.skuCode,
          quantity: Number(data.quantity),
          purchasePrice: Number(data.purchasePrice),
          gstAmount: Number(data.gstAmount),
          totalAmount: Number(data.totalAmount),
        },
      ],
    };

    const success = await onSubmit(purchaseData);

    if (success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="form-grid">
        <Select
          label="Supplier"
          name="supplier"
          register={register}
          error={errors.supplier?.message}
          options={[
            ...suppliers.map((supplier) => ({
              _id: supplier._id,
              label: `${supplier.supplierCode} - ${supplier.supplierName}`,
            })),
          ]}
        />

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
      </div>
      <div className="form-grid">
        <Select
          label="SKU Code"
          name="skuCode"
          register={register}
          error={errors.skuCode?.message}
          options={[
            ...(selectedProduct?.variants || []).map((variant) => ({
              _id: variant.skuCode,
              label: variant.skuCode,
            })),
          ]}
        />

        <Input
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Quantity"
          register={register}
          error={errors.quantity?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Purchase Price"
          name="purchasePrice"
          type="number"
          placeholder="Purchase Price"
          register={register}
          error={errors.purchasePrice?.message}
        />

        <Input
          label="GST Amount"
          name="gstAmount"
          type="number"
          placeholder="GST Amount"
          register={register}
          error={errors.gstAmount?.message}
        />
      </div>
      <div className="form-grid">
        <Input
          label="Paid Amount"
          name="paidAmount"
          type="number"
          placeholder="Paid Amount"
          register={register}
          error={errors.paidAmount?.message}
        />

        <Input
          label="Total Amount"
          name="totalAmount"
          type="number"
          placeholder="Total Amount"
          register={register}
          error={errors.totalAmount?.message}
        />
      </div>
      <div className="form-buttons">
        <SaveButton>{editId ? "Update Purchase" : "Save Purchase"}</SaveButton>
        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </div>
    </form>
  );
};

export default PurchaseForm;
