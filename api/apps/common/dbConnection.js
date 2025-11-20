const sql = require("mssql");
const config = require("./dbConfig");

let pool = null;

/**
 * Get or create database connection pool
 * @returns {Promise<sql.ConnectionPool>}
 */
const getConnection = async () => {
  try {
    if (pool && pool.connected) {
      return pool;
    }

    pool = await sql.connect(config);
    console.log("Connected to SQL Server database");
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

/**
 * Close database connection pool
 */
const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log("Database connection closed");
    }
  } catch (err) {
    console.error("Error closing database connection:", err);
    throw err;
  }
};

/**
 * Execute a query against the database
 * @param {string} query - SQL query string
 * @param {Object} params - Query parameters
 * @returns {Promise<sql.IResult>}
 */
const executeQuery = async (query, params = {}) => {
  console.log("################################");
  console.log("Executing query:", query, "with params:", params);
  console.log("################################");
  try {
    const connection = await getConnection();
    const request = connection.request();

    // Add parameters to the request
    Object.keys(params).forEach((key) => {
      request.input(key, params[key]);
    });

    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error("Query execution error:", err);
    throw err;
  }
};

module.exports = {
  getConnection,
  closeConnection,
  executeQuery,
  sql, // Export sql object for type definitions
};
