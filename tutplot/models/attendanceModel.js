const { poolPromise, sql } = require("../config/db");

async function getAllAttendances() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT attendance_id as id, class_name as standard, attendance_date as date, handling_staff as staff, student_id, student_name as name, status 
    FROM tutplot1.attendance_table
  `);
  return result.recordset;
}

async function createAttendance(data) {
  const pool = await poolPromise;
  const safeDate = data.form?.date && data.form.date.trim() !== "" ? new Date(data.form.date) : null;
  
  const deleteReq = pool.request();
  deleteReq.input("class_name", sql.VarChar, data.form?.standard || "");
  deleteReq.input("attendance_date", sql.Date, safeDate);
  await deleteReq.query(`
    DELETE FROM tutplot1.attendance_table 
    WHERE class_name = @class_name AND attendance_date = @attendance_date
  `);

  for (const student of (data.students || [])) {
    const req = pool.request();
    req.input("class_name", sql.VarChar, data.form?.standard || "");
    req.input("attendance_date", sql.Date, safeDate);
    req.input("handling_staff", sql.VarChar, data.form?.staff || "");
    
    req.input("student_id", sql.Int, student.id ? parseInt(student.id, 10) : null);
    req.input("student_name", sql.VarChar, student.name || "");
    req.input("status", sql.VarChar, student.status || "absent");
    
    await req.query(`
      INSERT INTO tutplot1.attendance_table (class_name, attendance_date, handling_staff, student_id, student_name, status)
      VALUES (@class_name, @attendance_date, @handling_staff, @student_id, @student_name, @status)
    `);
  }
  return true;
}

module.exports = { getAllAttendances, createAttendance };
