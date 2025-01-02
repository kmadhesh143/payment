// api/payment-success.js
module.exports = (req, res) => {
  const { status, txnId } = req.query;  // Extract status and txnId from query params

  // Check if the payment was successful
  if (status === 'success') {
    res.status(200).send(`<h1>Payment Successful!</h1><p>Transaction ID: ${txnId}</p>`);
  } else {
    res.status(400).send('<h1>Payment Failed. Please try again.</h1>');
  }
};
