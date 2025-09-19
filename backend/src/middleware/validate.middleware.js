const {body, validationResult} = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({errors: error.array()});
  }
  next();
};

const registerUserValidations = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({min: 3})
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long"),

  body("fullName.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .isLength({min: 2})
    .withMessage("First name must be at least 2 characters long"),

  body("fullName.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .isLength({min: 2})
    .withMessage("Last name must be at least 2 characters long"),

  respondWithValidationErrors,
];
 
module.exports = {registerUserValidations}