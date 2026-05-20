const { poolPromise } = require("./config/db");

async function fixTable() {
  try {
    const pool = await poolPromise;
    console.log("Recreating exam_marks table...");

    await pool.request().query(`
      IF OBJECT_ID('tutplot1.exam_marks', 'U') IS NOT NULL
        DROP TABLE tutplot1.exam_marks;
    `);

    await pool.request().query(`
      CREATE TABLE tutplot1.exam_marks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        student_name VARCHAR(100),
        class_name VARCHAR(20),
        exam_name VARCHAR(50),
        exam_date DATE,
        subjects_data NVARCHAR(MAX)
      );
    `);

    console.log("Table recreated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixTable();
