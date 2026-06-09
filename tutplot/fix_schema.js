require("dotenv").config();
const { poolPromise } = require("./config/db");

async function fixSchema() {
  try {
    const pool = await poolPromise;
    const checkQuery = `
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('tutplot1.student_application_table1') 
        AND name = 'student_name'
      )
      BEGIN
        ALTER TABLE tutplot1.student_application_table1 ADD student_name VARCHAR(100);
      END
    `;
    await pool.request().query(checkQuery);
    console.log("Schema fixed successfully.");
  } catch (err) {
    console.error("Error fixing schema:", err);
  }
  process.exit();
}

fixSchema();

