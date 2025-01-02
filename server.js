const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Mock database to track payment status
const payments = {};

// API to generate UPI link
app.post("/api/generate-upi", (req, res) => {
  const { amount, transactionId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // Generate UPI link
  const upiId = "kmadhesh1017@okicici"; // Replace with your UPI ID
  const name = "Madhesh"; // Replace with your name
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

  // Save transaction status
  payments[transactionId] = { status: "pending" };

  res.json({ upiUrl });
});

// API to check payment status (mocking success after 5 seconds)
app.get("/api/check-payment/:transactionId", (req, res) => {
  const { transactionId } = req.params;

  // Mock payment success after 5 seconds
  setTimeout(() => {
    if (payments[transactionId]) {
      payments[transactionId].status = "success";
    }
  }, 5000);

  const payment = payments[transactionId];
  if (!payment) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json({ status: payment.status });
});

// Serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
