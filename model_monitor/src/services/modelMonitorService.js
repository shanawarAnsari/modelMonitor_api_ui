import axios from "axios";

const ROP_API_BASE_URL = "http://localhost:3001/api/rop-monitor";
const ST_API_BASE_URL = "http://localhost:3001/api/st-monitor";

// ========================================
// Rate of Operations (ROP) Monitor APIs
// ========================================

export const getAvailableMonths = () =>
  axios.get(`${ROP_API_BASE_URL}/available-months`);

export const getMetricCards = (selectedMonth) =>
  axios.get(`${ROP_API_BASE_URL}/metric-cards?selectedMonth=${selectedMonth}`);

export const getMonthlyTrends = () =>
  axios.get(`${ROP_API_BASE_URL}/monthly-trends`);

export const getMetricTrendsCards = () =>
  axios.get(`${ROP_API_BASE_URL}/metric-trends-cards`);

export const getGroupedMetrics = (groupBy, selectedMonth, selectedGroups) =>
  axios.get(`${ROP_API_BASE_URL}/grouped-metrics`, {
    params: { groupBy, selectedMonth, selectedGroups },
  });

export const getTrendsGroupedMetrics = (groupBy, selectedGroups) =>
  axios.get(`${ROP_API_BASE_URL}/trends-grouped-metrics`, {
    params: { groupBy, selectedGroups },
  });

// ========================================
// Setup Time Monitor APIs
// ========================================

export const getSTAvailableMonths = () =>
  axios.get(`${ST_API_BASE_URL}/available-months`);

export const getSTMetricCards = (selectedMonth) =>
  axios.get(`${ST_API_BASE_URL}/metric-cards?selectedMonth=${selectedMonth}`);

export const getSTMonthlyTrends = () =>
  axios.get(`${ST_API_BASE_URL}/monthly-trends`);

export const getSTMetricTrendsCards = () =>
  axios.get(`${ST_API_BASE_URL}/metric-trends-cards`);

export const getSTGroupedMetrics = (groupBy, selectedMonth, selectedGroups) =>
  axios.get(`${ST_API_BASE_URL}/grouped-metrics`, {
    params: { groupBy, selectedMonth, selectedGroups },
  });

export const getSTTrendsGroupedMetrics = (groupBy, selectedGroups) =>
  axios.get(`${ST_API_BASE_URL}/trends-grouped-metrics`, {
    params: { groupBy, selectedGroups },
  });
