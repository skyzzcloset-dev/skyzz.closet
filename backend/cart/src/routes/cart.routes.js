const express = require("express")
const {createAuthMiddleware} = require("../middlewares/auth.middleware")
const {validateCartItem} = require("../middlewares/validator.middleware")
const {addItemToCart} = require("../controllers/cart.controller")



const router = express.Router()

router.post("/items" , validateCartItem , createAuthMiddleware(["customer"]) , addItemToCart )

module.exports = router