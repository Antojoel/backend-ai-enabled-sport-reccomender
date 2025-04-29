const { Pool } = require("pg");

const pool = new Pool({
  host: "ep-noisy-brook-a4wnc63n-pooler.us-east-1.aws.neon.tech",
  user: "aadhira-gamma_owner",
  database: "aadhira-gamma",
  password: "npg_xCLrOE7VXpA1",
  port: 5432, // no quotes, it's a number
  ssl: {
    rejectUnauthorized: false, // allow self-signed certificates
  }
});

// Test the connection
pool.connect()
  .then(client => {
    console.log("PostgreSQL connected successfully!");
    client.release();
  })
  .catch(err => {
    console.error("Error connecting to PostgreSQL:", err.message);
  });

module.exports = pool;
