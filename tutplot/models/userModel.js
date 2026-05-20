const { poolPromise } = require("../config/db");

async function createUser(email, password, mobile) {
  const pool = await poolPromise;
  
  // Get max management_id since it's not IDENTITY
  const result = await pool.request().query("SELECT ISNULL(MAX(management_id), 0) + 1 AS next_id FROM tutplot1.login");
  const nextId = result.recordset[0].next_id;

  const request = pool.request();
  request.input("management_id", nextId);
  request.input("email_id", email);
  request.input("password", password);
  request.input("mobile_number", mobile);

  const query = `
    INSERT INTO tutplot1.login (management_id, email_id, password, mobile_number)
    VALUES (@management_id, @email_id, @password, @mobile_number)
  `;
  return request.query(query);
}

async function getUsers() {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM tutplot1.login");
  return result.recordset;
}

async function findUserByEmail(email) {
  const pool = await poolPromise;
  const request = pool.request();
  request.input("email_id", email);
  const result = await request.query("SELECT * FROM tutplot1.login WHERE email_id = @email_id");
  return result.recordset[0];
}

module.exports = { createUser, getUsers, findUserByEmail };
