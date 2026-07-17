import * as yup from "yup";

export const taxValidation = (mode) => yup.object({

    taxName:yup.string().required(),
    taxCode:yup.string().required().matches(/^[A-Z]{3,5}$/, "Tax code must be 3-5 uppercase letters"),
    taxPercentage:yup.number().required().min(0, "Tax percentage must be at least 0").max(100, "Tax percentage cannot exceed 100"),
    taxType:yup.string().required().oneOf(["GST", "VAT", "Sales Tax"], "Invalid tax type"),
    isActive:yup.boolean().required()

});