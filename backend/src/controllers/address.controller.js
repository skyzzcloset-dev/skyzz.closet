const addressModel = require("../models/address.model");

async function addAddress(req, res) {
  try {
    const address = await addressModel.create(req.body);
    res.status(201).json({ message: "Address added successfully", address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAddresses(req, res) {
  try {
    const addresses = await addressModel.find({ user: req.user._id });
    res.status(200).json({ message: "Addresses fetched successfully", addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAddress(req, res) {
  try {
    const updated = await addressModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address updated successfully", address: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAddress(req, res) {
  try {
    const deleted = await addressModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address deleted successfully", addressId: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addAddress, getAddresses, updateAddress, deleteAddress };
