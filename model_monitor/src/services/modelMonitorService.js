import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/rop-monitor";

export const getAvailableMonths = () =>
  axios.get(`${API_BASE_URL}/available-months`);

export const getMetricCards = (selectedMonth) =>
  axios.get(`${API_BASE_URL}/metric-cards?selectedMonth=${selectedMonth}`);

export const getMonthlyTrends = () => axios.get(`${API_BASE_URL}/monthly-trends`);

export const getGroupedMetrics = (groupBy, selectedMonth, selectedGroups) =>
  axios.get(`${API_BASE_URL}/grouped-metrics`, {
    params: { groupBy, selectedMonth, selectedGroups },
  });

export const getTrendsGroupedMetrics = (groupBy, selectedGroups) =>
  axios.get(`${API_BASE_URL}/trends-grouped-metrics`, {
    params: { groupBy, selectedGroups },
  });
