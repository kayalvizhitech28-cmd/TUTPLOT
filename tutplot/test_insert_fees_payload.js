const { createFees } = require('./models/feesModel');
async function run() {
  try {
    const reqBody = {
      student_id: "1",
      class: "10th",
      totalfees: "5000",
      feespaid: "1000",
      pendingfees: "4000",
      dateofpayment: "2025-05-20",
      paymentment: "cash"
    };
    await createFees(reqBody);
    console.log("Fees created via frontend payload successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating fees:", err);
    process.exit(1);
  }
}
run();
