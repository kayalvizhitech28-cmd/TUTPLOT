const { poolPromise, sql } = require("../config/db");

async function getAllFeess() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT f.*, s.student_name 
    FROM tutplot1.fees_details_table f
    LEFT JOIN tutplot1.student_application_table01 s ON f.student_id = s.student_id
  `);
  return result.recordset;
}

async function createFees(data) {
  const pool = await poolPromise;

  // Autogenerate payment_id
  const maxIdResult = await pool.request().query("SELECT ISNULL(MAX(payment_id), 0) + 1 AS nextId FROM tutplot1.fees_details_table");
  const nextId = maxIdResult.recordset[0].nextId;

  const request = pool.request();
  
  const safeDate = (d) => {
    if (!d || d.trim() === "") return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  request.input('payment_id', sql.Int, nextId);
  request.input('student_id', sql.Int, data.student_id);
  request.input('total_fees', sql.Int, data.total_fees || data.totalfees);
  request.input('fees_paid', sql.Int, data.fees_paid || data.feespaid);
  request.input('date_of_pay', sql.Date, safeDate(data.date_of_pay || data.dateofpayment));
  request.input('pending_fees', sql.Int, data.pending_fees || data.pendingfees);
  request.input('payment_method', sql.VarChar, data.payment_method || data.paymentment || 'cash');

  const query = `
    INSERT INTO tutplot1.fees_details_table 
    (payment_id, student_id, total_fees, fees_paid, date_of_pay, pending_fees, payment_method) 
    VALUES 
    (@payment_id, @student_id, @total_fees, @fees_paid, @date_of_pay, @pending_fees, @payment_method);

    UPDATE tutplot1.student_application_table01
    SET total_fees = @total_fees, pending_fees = @pending_fees
    WHERE student_id = @student_id;
  `;
  
  return request.query(query);
}

module.exports = { getAllFeess, createFees };
