const { poolPromise } = require('./config/db.js');
async function run() {
  try {
    const pool = await poolPromise;
    const res = await pool.request().query("SELECT OBJECT_NAME(f.parent_object_id) TableName, COL_NAME(fc.parent_object_id,fc.parent_column_id) ColName, OBJECT_NAME (f.referenced_object_id) AS ReferenceTableName, COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferenceColumnName FROM sys.foreign_keys AS f INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID = fc.constraint_object_id WHERE OBJECT_NAME(f.parent_object_id) = 'fees_details_table'");
    console.log(res.recordset);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
