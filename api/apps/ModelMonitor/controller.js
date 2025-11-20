const ropMonitorRepository = require("./repository");

// Get available months
const getAvailableMonths = async (req, res) => {
  try {
    const data = await ropMonitorRepository.getAvailableMonths();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching available months:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available months",
      error: error.message,
    });
  }
};

// Get metric cards for selected month
const getMetricCards = async (req, res) => {
  try {
    const { selectedMonth } = req.query;

    if (!selectedMonth) {
      return res.status(400).json({
        success: false,
        message: "selectedMonth parameter is required",
      });
    }

    const data = await ropMonitorRepository.getMetricCards(selectedMonth);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching metric cards:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching metric cards",
      error: error.message,
    });
  }
};

// Get monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const data = await ropMonitorRepository.getMonthlyTrends();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monthly trends:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly trends",
      error: error.message,
    });
  }
};

// Get grouped metrics
const getGroupedMetrics = async (req, res) => {
  try {
    const { groupBy, selectedMonth, selectedGroups } = req.query;

    if (!groupBy) {
      return res.status(400).json({
        success: false,
        message: "groupBy parameter is required",
      });
    }

    const groupsArray = selectedGroups ? selectedGroups.split(",") : null;
    const data = await ropMonitorRepository.getGroupedMetrics(
      groupBy,
      selectedMonth,
      groupsArray
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching grouped metrics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching grouped metrics",
      error: error.message,
    });
  }
};

// Get trends grouped metrics
const getTrendsGroupedMetrics = async (req, res) => {
  try {
    const { groupBy, selectedGroups } = req.query;

    if (!groupBy) {
      return res.status(400).json({
        success: false,
        message: "groupBy parameter is required",
      });
    }

    const groupsArray = selectedGroups ? selectedGroups.split(",") : null;
    const data = await ropMonitorRepository.getTrendsGroupedMetrics(
      groupBy,
      groupsArray
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching trends grouped metrics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trends grouped metrics",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableMonths,
  getMetricCards,
  getMonthlyTrends,
  getGroupedMetrics,
  getTrendsGroupedMetrics,
};
