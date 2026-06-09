const { poolPromise } = require('./config/db');
poolPromise.then(async pool => {
  try {
    const t2 = await pool.request().query("SELECT TOP 1 * FROM tutplot1.student_application_table2");
    const t3 = await pool.request().query("SELECT TOP 1 * FROM tutplot1.student_application_table3");
    console.log('table2 columns:', Object.keys(t2.recordset[0] || {}));
    console.log('table3 columns:', Object.keys(t3.recordset[0] || {}));
  } catch (e) {
    console.log(e.message);
  } finally {
    process.exit(0);
  }
});

