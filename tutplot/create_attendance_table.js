const { poolPromise } = require("./config/db");

async function fixTable() {
  try {
    const pool = await poolPromise;
    console.log("Creating attendance_table...");

    await pool.request().query(`
      IF OBJECT_ID('tutplot1.attendance_table', 'U') IS NOT NULL
        DROP TABLE tutplot1.attendance_table;
    `);

    await pool.request().query(`
      create table tutplot1.attendance_table (
        attendance_id int IDENTITY(1,1) primary key,
        class_name varchar(50),
        attendance_date date,
        handling_staff varchar(100),
        student_id int,
        student_name varchar(100),
        status varchar(20)
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
