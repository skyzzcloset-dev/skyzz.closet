const { body, param, query, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 🟢 Create Order
const createOrderValidations = [
  // currently no body fields to validate (cart comes from token)
  respondWithValidationErrors,
];

// 🟢 Get My Orders
const getMyOrdersValidations = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  respondWithValidationErrors,
];

// 🟢 Cancel Order
const cancelOrderValidations = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),

  respondWithValidationErrors,
];

// 🟢 Update Order Address
const updateOrderAddressValidations = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),

  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street is required"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.zip")
    .trim()
    .notEmpty()
    .withMessage("Zip is required"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  respondWithValidationErrors,
];

// 🟢 Get Order By ID
const getOrderByIdValidations = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID"),

  respondWithValidationErrors,
];

module.exports = {
  createOrderValidations,
  getMyOrdersValidations,
  cancelOrderValidations,
  updateOrderAddressValidations,
  getOrderByIdValidations,
};
