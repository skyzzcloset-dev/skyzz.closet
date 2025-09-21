const {body, validationResult} = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  next();
}

const createProductValidations = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
  body("sizes").optional().isArray().withMessage("Sizes must be an array"),
  body("colors").optional().isArray().withMessage("Colors must be an array"),
  body("category").notEmpty().withMessage("Category is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  validate,
];

module.exports = {
  createProductValidations,
};
