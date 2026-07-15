import * as yup from "yup";

export const dashboardFilterValidation = yup.object({
  startDate: yup.date().required("Start date is required"),

  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date can't be before start date"),
});
