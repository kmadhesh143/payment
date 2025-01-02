const transactionId = `txn_${Date.now()}`; // Unique transaction ID

document.getElementById("generate").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  const statusText = document.getElementById("status");

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    // Generate UPI link
    const response = await fetch("/api/generate-upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, transactionId }),
    });
    const { upiUrl } = await response.json();

    // Generate QR Code
    const qr = new QRious({
      element: document.getElementById("qrcode"),
      value: upiUrl,
      size: 200,
    });

    statusText.textContent = "Waiting for payment...";
    checkPaymentStatus();
  } catch (error) {
    statusText.textContent = "Error generating QR code";
  }
});

// Polling to check payment status
async function checkPaymentStatus() {
  const statusText = document.getElementById("status");

  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/check-payment/${transactionId}`);
      const { status } = await response.json();

      if (status === "success") {
        clearInterval(interval);
        statusText.textContent = "Payment successful!";
        window.location.href = "/success"; // Redirect to success page
      }
    } catch (error) {
      statusText.textContent = "Error checking payment status";
    }
  }, 3000); // Check every 3 seconds
}
