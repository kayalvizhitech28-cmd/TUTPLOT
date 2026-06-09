const { poolPromise } = require("./config/db");

async function fixExamSchema() {
  try {
    const pool = await poolPromise;
    console.log("Creating exam_marks table...");

    await pool.request().query(`
      IF OBJECT_ID('tutplot1.exam_marks', 'U') IS NULL
      BEGIN
        CREATE TABLE tutplot1.exam_marks (
          id INT IDENTITY(1,1) PRIMARY KEY,
          student_name VARCHAR(100),
          class_name VARCHAR(20),
          exam_name VARCHAR(50),
          exam_date DATE,
          tamil INT DEFAULT 0,
          english INT DEFAULT 0,
          maths INT DEFAULT 0,
          science INT DEFAULT 0,
          social INT DEFAULT 0
        );
      END
    `);
    
    console.log("Table created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating schema:", err);
    process.exit(1);
  }
}

fixExamSchema();

