const express = require("express")
const router = express.Router()

router.post("/")
router.post("/:orderId")
router.get("/track/:awbCode")



module.exports = router