const { createFees } = require('./models/feesModel');
async function run() {
  try {
    await createFees({
      student_id: 1,
      totalfees: 5000,
      feespaid: 1000,
      dateofpayment: "2025-05-20",
      pendingfees: 4000,
      paymentment: "cash"
    });
    console.log("Fees created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating fees:", err);
    process.exit(1);
  }
}
run();
