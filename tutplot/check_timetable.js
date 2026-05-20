const { sql, poolPromise } = require("./config/db.js");

async function run() {
  try {
    const pool = await poolPromise;
    console.log("Checking timetable...");
    const result = await pool.request().query("SELECT * FROM timetable");
    console.log("Timetable rows:", result.recordset.length);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
run();
