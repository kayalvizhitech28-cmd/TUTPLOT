const { poolPromise, sql } = require("../config/db");

async function getAllStaffs() {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM tutplot1.staff_application_table01");
  return result.recordset;
}

async function createStaff(data) {
  const pool = await poolPromise;
  // Get max staff_id to auto-increment since it's not IDENTITY
  const maxIdResult = await pool.request().query("SELECT ISNULL(MAX(staff_id), 0) + 1 AS nextId FROM tutplot1.staff_application_table01");
  const nextId = maxIdResult.recordset[0].nextId;

  const request = pool.request();

  const safeDate = (d) => {
    if (!d || d.trim() === "") return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  request.input('staff_id', sql.Int, data.staff_id || nextId);
  request.input('staff_name', sql.VarChar(30), data.staff_name || data.name);
  request.input('date_of_birth', sql.Date, safeDate(data.date_of_birth || data.dob));
  request.input('address', sql.VarChar(50), data.address);
  request.input('contact_number', sql.VarChar(12), data.contact_number || data.contactnumber);
  request.input('email_id', sql.VarChar(100), data.email_id || data.emailid);
  request.input('qualification', sql.VarChar(20), data.qualification);
  request.input('specialization', sql.VarChar(20), data.specialization);
  request.input('joining_date', sql.Date, safeDate(data.joining_date || data.joiningdate));

  const query = `
    INSERT INTO tutplot1.staff_application_table01 
    (staff_id, staff_name, date_of_birth, address, contact_number, email_id, qualification, specialization, joining_date) 
    VALUES 
    (@staff_id, @staff_name, @date_of_birth, @address, @contact_number, @email_id, @qualification, @specialization, @joining_date)
  `;

  return request.query(query);
}

module.exports = { getAllStaffs, createStaff };
