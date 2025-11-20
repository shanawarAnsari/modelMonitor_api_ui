const express = require("express");
const ropMonitorController = require("./controller");

const router = express.Router();

// Get available months for ROP data
router.get("/available-months", ropMonitorController.getAvailableMonths);

// Get metric cards data for a specific month
router.get("/metric-cards", ropMonitorController.getMetricCards);

// Get monthly trends across all months
router.get("/monthly-trends", ropMonitorController.getMonthlyTrends);

// Get grouped metrics by dimension (interface, platform, etc.)
router.get("/grouped-metrics", ropMonitorController.getGroupedMetrics);

// Get trends grouped by dimension
router.get("/trends-grouped-metrics", ropMonitorController.getTrendsGroupedMetrics);

module.exports = router;
