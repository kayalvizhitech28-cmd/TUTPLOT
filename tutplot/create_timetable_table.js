const { poolPromise } = require("./config/db");

async function createTable() {
  try {
    const pool = await poolPromise;
    console.log("Creating timetable_table...");

    // Drop if exists to recreate exactly as requested (with slight adjustments)
    await pool.request().query(`
      IF OBJECT_ID('tutplot1.timetable_table', 'U') IS NOT NULL
        DROP TABLE tutplot1.timetable_table;
    `);

    // Create the table. I'll add class_name because the UI needs it, and make subject_id IDENTITY so the computed column works easily.
    await pool.request().query(`
      create table tutplot1.timetable_table (
        subject_id int IDENTITY(1,1) primary key,
        class_name varchar(50),
        subject_name varchar(100),
        day varchar(20),
        handling_staff varchar(100)
      );
    `);

    await pool.request().query(`
      alter table tutplot1.timetable_table
      add subject_code as ('SUB'+right('000'+cast(subject_id as varchar(20)),3)) persisted;
    `);

    console.log("Table created!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createTable();

