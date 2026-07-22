import Joi from "joi";

const objectId = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message('"{{#label}}" must be a valid ID');

const createPurchaseReturnSchema = Joi.object({
  returnNo: Joi.string().trim().required().messages({
    "string.empty": "Return No is required",
    "any.required": "Return No is required",
  }),

  purchase: objectId.required().messages({
    "any.required": "Purchase is required",
    "string.empty": "Purchase is required",
  }),

  supplier: objectId.required().messages({
    "any.required": "Supplier is required",
    "string.empty": "Supplier is required",
  }),

  returnDate: Joi.date().required().messages({
    "date.base": "Return Date must be a valid date",
    "any.required": "Return Date is required",
  }),

  refundAmount: Joi.number().positive().required().messages({
    "number.base": "Refund Amount must be a number",
    "number.positive": "Refund Amount must be greater than 0",
    "any.required": "Refund Amount is required",
  }),

  reason: Joi.string().trim().required().messages({
    "string.empty": "Reason is required",
    "any.required": "Reason is required",
  }),
});

const updatePurchaseReturnSchema = Joi.object({
  returnNo: Joi.string().trim().messages({
    "string.empty": "Return No is required",
  }),

  purchase: objectId.messages({
    "string.empty": "Purchase is required",
  }),

  supplier: objectId.messages({
    "string.empty": "Supplier is required",
  }),

  returnDate: Joi.date().messages({
    "date.base": "Return Date must be a valid date",
  }),

  refundAmount: Joi.number().positive().messages({
    "number.base": "Refund Amount must be a number",
    "number.positive": "Refund Amount must be greater than 0",
  }),

  reason: Joi.string().trim().messages({
    "string.empty": "Reason is required",
  }),
}).min(1);

const idParamSchema = Joi.object({
  id: objectId.required().messages({
    "any.required": "A valid Purchase Return ID is required",
  }),
});

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, errors });
    }

    req[source] = value;
    next();
  };

export const validateCreatePurchaseReturn = validate(
  createPurchaseReturnSchema,
  "body",
);
export const validateUpdatePurchaseReturn = validate(
  updatePurchaseReturnSchema,
  "body",
);
export const validatePurchaseReturnIdParam = validate(idParamSchema, "params");

export {
  createPurchaseReturnSchema,
  updatePurchaseReturnSchema,
  idParamSchema,
};
