// models/User.js
const pool = require('../db');

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function createUser(username, email, hashedPassword, role) {
  const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [username, email, hashedPassword, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
};
