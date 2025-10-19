const axios = require("axios");

async function checkPaymentStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const { data } = await axios.get(
      `https://api.razorpay.com/v1/payments/${orderId}`,
      {
        auth: {
          username: process.env.RAZORPAY_TEST_KEY_ID,
          password: process.env.RAZORPAY_TEST_SECRET,
        },
      }
    );

    if (data.status === "captured" || data.status === "COMPLETED") {
      next();
    } else {
      return res.status(402).json({ message: "Payment required" });
    }
  } catch (error) {
    console.error("Payment status check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { checkPaymentStatus };
