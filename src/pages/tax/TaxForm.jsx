import "./TaxForm.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import {SaveButton} from "../../components/common/Button";

import { taxValidation } from "../../validations/TaxValidation";
import { createTax, updateTax } from "../../features/tax/taxSlice";

import toaster from "../../utils/toaster";

import { useEffect } from "react";

export default function TaxForm({ mode = "add", tax = null, onClose, onSuccess }) {

    const dispatch = useDispatch();

    const {

        register,
        handleSubmit,
        reset,
        formState: { errors }

    } = useForm({

        resolver: yupResolver(taxValidation(mode)),

    });

    useEffect(() => {
        if (mode === "edit" && tax) {
            reset({
                taxName: tax.taxName,
                taxCode: tax.taxCode,
                taxPercentage: tax.taxPercentage,
                taxType: tax.taxType,
                isActive: tax.isActive
            });
        } else {
            reset({
                taxName: "",
                taxCode: "",
                taxPercentage: "",
                taxType: "",
                isActive: true
            });
        }
    }, [mode, tax, reset]);

    
const onSubmit = async (data) => {
  let result;

  if (mode === "add") {
    result = await dispatch(createTax(data));
    toaster.success("Tax created successfully!");
  } else {
    result = await dispatch(
      updateTax({
        id: tax._id,
        data,
      })
    );
    toaster.success("Tax updated successfully!");
  }

  if (
    createTax.fulfilled.match(result) ||
    updateTax.fulfilled.match(result)
  ) {
    onSuccess();
  }
};

    return(

        <form onSubmit={handleSubmit(onSubmit)} className="user-form">

            <div className="form-grid">

                <Input
                    label="Tax Name"
                    name="taxName"
                    register={register}
                    error={errors.taxName?.message}
                />

                <Input
                    label="Tax Code"
                    name="taxCode"
                    register={register}
                    error={errors.taxCode?.message}
                />

            </div>

            <div className="form-grid">

                <Input
                    label="Tax Percentage"
                    name="taxPercentage"
                    register={register}
                    error={errors.taxPercentage?.message}
                />

                <Select
                    label="Tax Type"
                    name="taxType"
                    register={register}
                    error={errors.taxType?.message}
                    options={[
                        { _id: "GST", label: "GST" },
                        { _id: "CGST", label: "CGST" },
                        { _id: "SGST", label: "SGST" },
                        { _id: "IGST", label: "IGST" },
                    ]}
                />

            </div>

            <div className="form-grid">

                <Select
                    label="Is Active"
                    name="isActive"
                    register={register}
                    error={errors.isActive?.message}
                    options={[
                        { _id: true, label: "Active" },
                        { _id: false, label: "Inactive" },
                    ]}
                />

            </div>

            <div className="form-footer">
                <SaveButton>
                    {mode === "add" ? "Add Tax" : "Update Tax"}
                </SaveButton>
            </div>

        </form>

    );

}