const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  membershipStartDate: { type: Date, required: true },
  membershipExpiryDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], required: true },
  notes: { type: String },
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
