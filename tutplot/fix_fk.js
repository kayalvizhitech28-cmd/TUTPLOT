const { poolPromise } = require('./config/db.js');
async function run() {
  try {
    const pool = await poolPromise;
    console.log("Dropping old FK...");
    await pool.request().query("ALTER TABLE tutplot1.fees_details_table DROP CONSTRAINT FK_fees_student");
    console.log("Adding new FK...");
    await pool.request().query("ALTER TABLE tutplot1.fees_details_table ADD CONSTRAINT FK_fees_student FOREIGN KEY (student_id) REFERENCES tutplot1.student_application_table01(student_id)");
    console.log("Success");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

