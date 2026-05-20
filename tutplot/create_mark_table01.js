const { poolPromise } = require("./config/db");

async function fixTable() {
  try {
    const pool = await poolPromise;
    console.log("Creating mark_table01...");

    await pool.request().query(`
      IF OBJECT_ID('tutplot1.mark_table01', 'U') IS NOT NULL
        DROP TABLE tutplot1.mark_table01;
    `);

    // Added IDENTITY(1,1) to mark_id for auto-increment
    // Increased varchar size to prevent truncation errors
    await pool.request().query(`
      create table tutplot1.mark_table01 (
        mark_id int IDENTITY(1,1) primary key,
        exam_id int,
        student_id int,
        student_name varchar(100),
        class_name varchar(50),
        exam_name varchar(50), 
        subject_name varchar(50),
        subject_code varchar(20),
        marks int,
        exam_date date
      );
    `);

    console.log("Table created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixTable();
