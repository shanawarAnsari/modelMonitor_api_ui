const express = require("express");
const setupTimeMonitorController = require("./controller");

const router = express.Router();

// Get available months for Setup Time data
router.get("/available-months", setupTimeMonitorController.getAvailableMonths);

// Get metric cards data for a specific month
router.get("/metric-cards", setupTimeMonitorController.getMetricCards);

// Get metric trends cards for spark charts
router.get("/metric-trends-cards", setupTimeMonitorController.getMetricTrendsCards);

// Get monthly trends across all months
router.get("/monthly-trends", setupTimeMonitorController.getMonthlyTrends);

// Get grouped metrics by dimension (setup matrix, from/to setup group, etc.)
router.get("/grouped-metrics", setupTimeMonitorController.getGroupedMetrics);

// Get trends grouped by dimension
router.get(
  "/trends-grouped-metrics",
  setupTimeMonitorController.getTrendsGroupedMetrics
);

module.exports = router;
