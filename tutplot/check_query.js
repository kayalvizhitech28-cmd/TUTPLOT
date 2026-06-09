const { poolPromise } = require('./config/db');
poolPromise.then(async pool => {
  try {
    const q = `
      SELECT 
        s1.student_id, 
        s1.student_name, 
        s2.admission_for_class as class, 
        s3.total_fees
      FROM tutplot1.student_application_table1 s1
      LEFT JOIN tutplot1.student_application_table2 s2 ON s1.student_id = s2.educational_details_id
      LEFT JOIN tutplot1.student_application_table3 s3 ON CAST(s1.student_id AS VARCHAR) = s3.fees_id
    `;
    const result = await pool.request().query(q);
    console.log('Query success:', result.recordset.length, 'rows');
  } catch (e) {
    console.log('Query failed:', e.message);
  } finally {
    process.exit(0);
  }
});

