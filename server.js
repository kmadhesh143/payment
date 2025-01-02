app.post("/api/generate-upi", (req, res) => {
  const { amount, transactionId } = req.body;

  if (!amount || amount <= 0) {
    console.log("Invalid amount:", amount);
    return res.status(400).json({ error: "Invalid amount" });
  }

  // Generate UPI link
  const upiId = "kmadhesh1017@okicici"; // Replace with your UPI ID
  const name = "Madhesh"; // Replace with your name
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

  console.log("Generated UPI URL:", upiUrl);  // Log the UPI URL

  // Save transaction status
  payments[transactionId] = { status: "pending" };

  res.json({ upiUrl });
});
