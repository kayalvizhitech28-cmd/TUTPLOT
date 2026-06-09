const { poolPromise } = require('./config/db.js');
async function run() {
  try {
    const pool = await poolPromise;
    const res = await pool.request().query("SELECT name FROM sys.foreign_keys WHERE parent_object_id = OBJECT_ID('tutplot1.fees_details_table')");
    console.log(res.recordset);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

