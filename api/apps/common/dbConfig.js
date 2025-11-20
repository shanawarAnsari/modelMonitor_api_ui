require("dotenv").config();

const config = {
  server: process.env.DB_SERVER || "SUNNYPC\\SQLEXPRESS01", // Use instance name for named pipes
  database: process.env.DB_DATABASE || "ROP_MONITOR",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "Trap@1761",
  // Remove port - named pipes doesn't use it
  options: {
    encrypt: false, // Disable encryption for local SQL Server
    trustServerCertificate: true, // Trust self-signed certs for local dev
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    useUTC: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

module.exports = config;
