// models/User.js
const pool = require('../db');

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function findUserById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
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

async function updateUser(id, username, email) {
  const query = `
    UPDATE users
    SET username = $1, email = $2
    WHERE id = $3
    RETURNING *
  `;
  const values = [username, email, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getAllUsers() {
  const query = 'SELECT id, username, email, role, created_at FROM users';
  const { rows } = await pool.query(query);
  return rows;
}

async function deleteUser(id) {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getAllUsers,
  deleteUser
};