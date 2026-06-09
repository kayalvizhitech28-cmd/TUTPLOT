const { sql, poolPromise } = require("./config/db.js");

async function run() {
  try {
    const pool = await poolPromise;
    
    // First, let's see if tutplot1 exists as a schema, if not create it
    try {
        await pool.request().query(`
          IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'tutplot1')
          BEGIN
            EXEC('CREATE SCHEMA [tutplot1]');
          END
        `);
    } catch (e) {
        console.log("Error ensuring schema:", e.message);
    }

    const createQuery = `
      create table tutplot1.student_application_table01 (
        student_id int primary key,
        student_name varchar(30),
        date_of_birth date,
        class int,
        mother_name varchar(30),
        father_name varchar(30),
        school_name varchar(90),
        address varchar(50),
        contact_number varchar(12)
      );
    `;
    console.log("Executing Create Table...");
    await pool.request().query(createQuery);
    console.log("Table created successfully.");

    console.log("Executing Select...");
    const result = await pool.request().query(`select * from tutplot1.student_application_table01;`);
    console.log("Select result:", result.recordset);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();

