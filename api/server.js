const express = require("express");
const cors = require("cors");
const { closeConnection } = require("./apps/common");
const modelMonitorRoutes = require("./apps/ModelMonitor/routes");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Model Monitor API Server",
    version: "1.0.0",
    endpoints: {
      "GET /api/rop-monitor/available-months": "Get available months",
      "GET /api/rop-monitor/metric-cards": "Get metric cards for selected month",
      "GET /api/rop-monitor/monthly-trends": "Get monthly trends",
      "GET /api/rop-monitor/grouped-metrics": "Get grouped metrics",
      "GET /api/rop-monitor/trends-grouped-metrics": "Get trends grouped metrics",
    },
  });
});

// API Routes
app.use("/api/rop-monitor", modelMonitorRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  try {
    await closeConnection();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  try {
    await closeConnection();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Model Monitor API Server running at http://localhost:${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
  console.log(`📋 API documentation available at http://localhost:${port}`);
});
