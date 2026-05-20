const { poolPromise } = require('./config/db.js');
async function run() {
  try {
    const pool = await poolPromise;
    console.log("Adding payment_method column...");
    await pool.request().query("ALTER TABLE tutplot1.fees_details_table ADD payment_method varchar(20)");
    console.log("Success");
    process.exit(0);
  } catch (err) {
    if (err.message.includes("already has a")) {
      console.log("Column already exists");
      process.exit(0);
    }
    console.error(err);
    process.exit(1);
  }
}
run();
