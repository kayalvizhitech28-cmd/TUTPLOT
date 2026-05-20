const { poolPromise } = require('./config/db.js');
async function run() {
  try {
    const pool = await poolPromise;
    const res = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'timetable_table'");
    console.log(res.recordset);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
