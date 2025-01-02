const transactionId = `txn_${Date.now()}`; // Unique transaction ID

document.getElementById("generate").addEventListener("click", async () => {
  const amount = document.getElementById("amount").value;
  const statusText = document.getElementById("status");

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    // Generate UPI link by calling backend API
    const response = await fetch("/api/generate-upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, transactionId }),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      return;
    }

    const { upiUrl } = await response.json();
    if (!upiUrl) {
      console.error("UPI URL is empty");
      return;
    }

    // Generate the QR code
    const qr = new QRious({
      element: document.getElementById("qrcode"),
      value: upiUrl,
      size: 200,
    });

    // Update status message
    statusText.textContent = "Waiting for payment...";

    // Start checking payment status
    checkPaymentStatus();
  } catch (error) {
    console.error("Error generating QR code:", error);
    statusText.textContent = "Error generating QR code";
  }
});

// Function to check payment status
async function checkPaymentStatus() {
  const statusText = document.getElementById("status");

  const interval = setInterval(async () => {
    try {
      const response = await fetch(`/api/check-payment/${transactionId}`);
      const { status } = await response.json();

      if (status === "success") {
        clearInterval(interval);
        statusText.textContent = "Payment successful!";
        window.location.href = "/success"; // Redirect to success page (you can modify this URL)
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      statusText.textContent = "Error checking payment status";
    }
  }, 3000); // Check every 3 seconds
}
