const { poolPromise, sql } = require("../config/db");

async function getAllExams() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT student_name, class_name, exam_name, subject_name, subject_code, marks, exam_date 
    FROM tutplot1.mark_table01
  `);
  
  const grouped = {};
  result.recordset.forEach(row => {
    const key = `${row.student_name}_${row.class_name}_${row.exam_name}`;
    if (!grouped[key]) {
      grouped[key] = {
        id: Math.random(),
        student_name: row.student_name,
        class_name: row.class_name,
        exam_name: row.exam_name,
        date: row.exam_date,
        subjects: []
      };
    }
    grouped[key].subjects.push({
      subject: row.subject_name,
      code: row.subject_code,
      mark: row.marks
    });
  });
  
  return Object.values(grouped);
}

async function createExam(data) {
  const pool = await poolPromise;
  const request = pool.request();
  const safeDate = data.date && data.date.trim() !== "" ? new Date(data.date) : null;

  const deleteReq = pool.request();
  deleteReq.input("student_name", sql.VarChar, data.student || "");
  deleteReq.input("class_name", sql.VarChar, data.class_name || "");
  deleteReq.input("exam_name", sql.VarChar, data.exam || "");
  await deleteReq.query(`
    DELETE FROM tutplot1.mark_table01 
    WHERE student_name = @student_name AND class_name = @class_name AND exam_name = @exam_name
  `);

  for (const sub of (data.subjects || [])) {
    if (!sub.subject) continue;
    
    const req = pool.request();
    req.input("student_name", sql.VarChar, data.student || "");
    req.input("class_name", sql.VarChar, data.class_name || "");
    req.input("exam_name", sql.VarChar, data.exam || "");
    req.input("exam_date", sql.Date, safeDate);
    
    req.input("subject_name", sql.VarChar, sub.subject || "");
    req.input("subject_code", sql.VarChar, sub.code || "");
    req.input("marks", sql.Int, sub.mark ? parseInt(sub.mark, 10) : 0);
    
    await req.query(`
      INSERT INTO tutplot1.mark_table01 (student_name, class_name, exam_name, exam_date, subject_name, subject_code, marks)
      VALUES (@student_name, @class_name, @exam_name, @exam_date, @subject_name, @subject_code, @marks)
    `);
  }

  return true;
}

module.exports = { getAllExams, createExam };

