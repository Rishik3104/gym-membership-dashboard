const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");``
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
  
const cron = require('node-cron');
const Member = require('./models/member');

// Cron job to check for expired memberships daily at midnight
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const expiredMembers = await Member.find({
    membershipExpiryDate: { $lt: today },
  });

  if (expiredMembers.length > 0) {
    console.log('Expired Memberships:');
    expiredMembers.forEach((member) => {
      console.log(`- ${member.fullName} (${member.contactNumber})`);
    });
  } else {
    console.log('No expired memberships found.');
  }
});

// Routes
const memberRoutes = require("./routes/memberRoutes");
app.use("/api/members", memberRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


