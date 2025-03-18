const express = require("express");
const Member = require("../models/member");

const router = express.Router();

// ✅ Add a new member
router.post("/add", async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json({ message: "Member added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all members with search and filter options
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query; // Get query parameters
    let query = {}; // Base query

    // Add search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } }, // Case-insensitive search by name
        { contactNumber: { $regex: search, $options: "i" } }, // Case-insensitive search by contact number
      ];
    }

    // Add filter functionality
    if (status === "active") {
      const today = new Date();
      query.membershipExpiryDate = { $gte: today }; // Membership not expired
    } else if (status === "expiring-soon") {
      const today = new Date();
      const sevenDaysLater = new Date(today.setDate(today.getDate() + 7));
      query.membershipExpiryDate = { $gte: today, $lte: sevenDaysLater }; // Expiring within 7 days
    } else if (status === "expired") {
      const today = new Date();
      query.membershipExpiryDate = { $lt: today }; // Membership expired
    }

    const members = await Member.find(query);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a single member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update a member's details
router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member updated successfully", updatedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a member
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;