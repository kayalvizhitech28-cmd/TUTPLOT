const { poolPromise } = require("../config/db");

function parseSafeInt(val) {
  if (val === undefined || val === null) return 0;
  const cleaned = val.toString().replace(/[₹$,\s]/g, "").trim();
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

async function getAllStudents() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      s1.student_id, 
      s1.student_name, 
      s1.class, 
      s1.group_class,
      s1.date_of_birth,
      s1.mother_name,
      s1.father_name,
      s1.school_name,
      s1.address,
      s1.contact_number,
      s1.total_fees,
      s1.pending_fees
    FROM tutplot1.student_application_table01 s1
  `);
  return result.recordset;
}

async function createStudent(data) {
  const pool = await poolPromise;
  const { Name, DateofBirth, Standard, Group, MotherName, FatherName, schoolName, Address, contact, fee } = data;

  const idResult = await pool.request().query("SELECT ISNULL(MAX(student_id), 0) + 1 AS next_id FROM tutplot1.student_application_table01");
  const nextId = idResult.recordset[0].next_id;

  const request = pool.request();
  request.input("student_id", nextId);
  request.input("student_name", Name || '');
  request.input("date_of_birth", DateofBirth || null);
  
  // Clean Standard to an integer, if possible, or null
  const classInt = parseInt((Standard || "").replace(/\D/g, ''), 10);
  request.input("class", isNaN(classInt) ? null : classInt);
  request.input("group_class", Group || null);
  
  request.input("mother_name", MotherName || '');
  request.input("father_name", FatherName || '');
  request.input("school_name", schoolName || '');
  request.input("address", Address || '');
  request.input("contact_number", contact || '');
  
  const feeInt = parseSafeInt(fee);
  request.input("total_fees", feeInt);
  request.input("pending_fees", feeInt);

  const query = `
    INSERT INTO tutplot1.student_application_table01 
      (student_id, student_name, date_of_birth, class, group_class, mother_name, father_name, school_name, address, contact_number, total_fees, pending_fees)
    VALUES 
      (@student_id, @student_name, @date_of_birth, @class, @group_class, @mother_name, @father_name, @school_name, @address, @contact_number, @total_fees, @pending_fees)
  `;
  return request.query(query);
}

module.exports = { getAllStudents, createStudent };
