const { poolPromise } = require("./config/db");

async function fixSchema() {
  try {
    const pool = await poolPromise;
    console.log("Creating timetable table if it doesn't exist...");
    
    // Create schema tutplot1 if it doesn't exist
    try {
        await pool.request().query(`
          IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'tutplot1')
          BEGIN
            EXEC('CREATE SCHEMA [tutplot1]');
          END
        `);
    } catch(e) {}

    await pool.request().query(`
      IF OBJECT_ID('tutplot1.timetable', 'U') IS NULL
      BEGIN
        CREATE TABLE tutplot1.timetable (
          id INT IDENTITY(1,1) PRIMARY KEY,
          class_name VARCHAR(50),
          day VARCHAR(20),
          subject_code VARCHAR(20),
          subject VARCHAR(100),
          staff VARCHAR(100)
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

fixSchema();

