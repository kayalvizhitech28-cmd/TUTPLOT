const { poolPromise, sql } = require("../config/db");

async function getAllTimetables() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT class_name, day, subject_name as subject, handling_staff as staff, subject_code 
    FROM tutplot1.timetable_table
  `);
  return result.recordset;
}

async function createTimetable(data) {
  const pool = await poolPromise;
  
  // First, delete existing timetable for this class
  const deleteReq = pool.request();
  deleteReq.input("class_name", sql.VarChar, data.class_name);
  await deleteReq.query("DELETE FROM tutplot1.timetable_table WHERE class_name = @class_name");

  // Then, insert new schedule
  for (const row of data.schedule) {
    const req = pool.request();
    req.input("class_name", sql.VarChar, data.class_name);
    req.input("day", sql.VarChar, row.day);
    req.input("subject_name", sql.VarChar, row.subject || "");
    req.input("handling_staff", sql.VarChar, row.staff || "");
    req.input("subject_code", sql.VarChar, row.subject_code || "");
    await req.query(`
      INSERT INTO tutplot1.timetable_table (class_name, day, subject_name, handling_staff, subject_code)
      VALUES (@class_name, @day, @subject_name, @handling_staff, @subject_code)
    `);
  }
  return true;
}

module.exports = { getAllTimetables, createTimetable };

