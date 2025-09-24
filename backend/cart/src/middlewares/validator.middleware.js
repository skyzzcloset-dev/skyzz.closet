const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

function validateCartErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const validateCartItem = [
    body("productId")
    .isString()
    .withMessage("Product ID must be a string")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Product ID"),
    body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
    validateCartErrors
]



module.exports = { validateCartItem };