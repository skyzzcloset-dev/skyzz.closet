const categoryModel = require("../models/category.model");

async function addCategory(req, res) {
  try {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ message: "Category added", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ message: "Categories fetched", categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const updated = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const deleted = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted", categoryId: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addCategory, getCategories, updateCategory, deleteCategory };
