const {
  registerSchema,
} = require("../models/schemas/user");
const { addSchema, statusSchema } = require("../models/schemas/contact.js");
const { requestError } = require("./requestError.js");

const validateBody = (body) => {
  return addSchema.validate(body);
};

const validateUpdatedFields = (body, res) => {
  const { name, email, phone, favorite } = body;
  if (!name && !email && !phone && !favorite) {
    return res.status(400).json({ message: "missing fields" });
  }
  return addSchema.validate(body);
};

const validateStatusBody = (body) => {
  return statusSchema.validate(body);
};

const validateUser = (res, body) => {
  const validatedData = registerSchema.validate(body);
  if (validatedData.error) {
    return requestError(res, validatedData.error);
  }
};

module.exports = {
  validateBody,
  validateUpdatedFields,
  validateStatusBody,
  validateUser,
};