const userModel = require("../models/user.model");

async function getAllUsers(req, res) {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json({
      message: "All users fetched successfully",
      users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      message: "User fetched successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const { fullName, email, password, address } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.params.id,
        { fullName, email, password, address },
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      message: "User deleted successfully",
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
