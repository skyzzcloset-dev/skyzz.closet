const reviewModel = require("../models/review.model");

async function addReview(req, res) {
  try {
    const review = await reviewModel.create({ ...req.body, user: req.user._id });
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await reviewModel.find({ product: req.params.productId }).populate("user", "fullName");
    res.status(200).json({ message: "Reviews fetched", reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const deleted = await reviewModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted", reviewId: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addReview, getReviews, deleteReview };
