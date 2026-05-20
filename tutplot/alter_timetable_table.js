const { poolPromise } = require("./config/db");

async function fixTable() {
  try {
    const pool = await poolPromise;
    console.log("Altering timetable_table...");

    // Drop the computed column
    await pool.request().query(`
      ALTER TABLE tutplot1.timetable_table
      DROP COLUMN subject_code;
    `);

    // Add it back as a normal varchar
    await pool.request().query(`
      ALTER TABLE tutplot1.timetable_table
      ADD subject_code VARCHAR(20);
    `);

    console.log("Table altered successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixTable();
