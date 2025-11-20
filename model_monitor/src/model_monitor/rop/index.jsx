import React, { useState, useEffect } from "react";
import {
  getAvailableMonths,
  getMetricCards,
  getGroupedMetrics,
  getMonthlyTrends,
  getTrendsGroupedMetrics,
  getMetricTrendsCards,
} from "../../services/modelMonitorService";
import MetricCards from "./MetricCards";
import ErrorAnalysisChart from "./ErrorAnalysisChart";
import {
  Box,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
});

const ModelMonitor = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [viewMode, setViewMode] = useState("monthly");
  const [metrics, setMetrics] = useState({
    numberOfPO: 0,
    plannedRoMAE: 0,
    aimlRoMAE: 0,
  });
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState("INTERFACE");
  const [chartData, setChartData] = useState({
    categories: [],
    aiml: [],
    planned: [],
    allAvailableGroups: [],
    totalGroupsCount: 0,
  });
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    if (viewMode === "monthly" && selectedMonth) {
      fetchMetricCards();
      fetchChartData();
    } else if (viewMode === "trends") {
      fetchTrendsData();
      fetchTrendsChartData();
    }
  }, [selectedMonth, groupBy, viewMode]);

  const fetchAvailableMonths = async () => {
    try {
      const response = await getAvailableMonths();
      setMonths(response.data);
      if (response.data.length > 0) {
        setSelectedMonth(response.data[0].value);
      }
    } catch (error) {
      console.error("Error fetching months:", error);
    }
  };

  const fetchMetricCards = async () => {
    setLoading(true);
    try {
      const response = await getMetricCards(selectedMonth);
      setMetrics({
        numberOfPO: response.data.numberOfPO || 0,
        plannedRoMAE: response.data.plannedRoMAE?.toFixed(2) || 0,
        aimlRoMAE: response.data.aimlRoMAE?.toFixed(2) || 0,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (selectedGroups = null) => {
    try {
      setChartError(null);
      const groupsParam =
        selectedGroups && selectedGroups.length > 0
          ? selectedGroups.join(",")
          : null;
      const response = await getGroupedMetrics(groupBy, selectedMonth, groupsParam);
      const { groupedMetrics, allAvailableGroups, totalGroupsCount } = response.data;
      setChartData({
        categories: groupedMetrics.map((m) => m.groupName),
        aiml: groupedMetrics.map((m) => Number(m.aimlRoMAE.toFixed(2))),
        planned: groupedMetrics.map((m) => Number(m.plannedRoMAE.toFixed(2))),
        allAvailableGroups: allAvailableGroups || [],
        totalGroupsCount: totalGroupsCount || groupedMetrics.length,
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartError(`Data not available for the selected group`);
      setChartData({
        categories: [],
        aiml: [],
        planned: [],
        allAvailableGroups: [],
        totalGroupsCount: 0,
      });
    }
  };

  const fetchTrendsData = async () => {
    setLoading(true);
    try {
      const [trendsResponse, trendsCardsResponse] = await Promise.all([
        getMonthlyTrends(),
        getMetricTrendsCards(),
      ]);
      const trendsData = trendsResponse.data;
      const trendsCardsData = trendsCardsResponse.data;

      // Calculate aggregate metrics for trends
      const totalPO = trendsData.reduce((sum, item) => sum + item.numberOfPO, 0);
      const avgAimlRoMAE =
        trendsData.reduce((sum, item) => sum + item.aimlRoMAE, 0) /
        trendsData.length;
      const avgPlannedRoMAE =
        trendsData.reduce((sum, item) => sum + item.plannedRoMAE, 0) /
        trendsData.length;

      setMetrics({
        numberOfPO: totalPO || 0,
        plannedRoMAE: avgPlannedRoMAE?.toFixed(2) || 0,
        aimlRoMAE: avgAimlRoMAE?.toFixed(2) || 0,
        trendsData: trendsData,
        sparkChartsData: trendsCardsData,
      });
    } catch (error) {
      console.error("Error fetching trends data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendsChartData = async (selectedGroups = null) => {
    try {
      setChartError(null);
      const groupsParam =
        selectedGroups && selectedGroups.length > 0
          ? selectedGroups.join(",")
          : null;
      const response = await getTrendsGroupedMetrics(groupBy, groupsParam);
      const { groupedTrendsMetrics, allAvailableGroups, totalGroupsCount } =
        response.data;

      setChartData({
        trendsData: groupedTrendsMetrics,
        allAvailableGroups: allAvailableGroups || [],
        totalGroupsCount: totalGroupsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching trends chart data:", error);
      setChartError(`Data not available for the selected group`);
      setChartData({
        trendsData: [],
        allAvailableGroups: [],
        totalGroupsCount: 0,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 1.5,
          px: 1.5,
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 1.5,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 1.5,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1.5}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="primary"
                sx={{ fontSize: "1.1rem" }}
              >
                Model Monitor Dashboard
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {viewMode === "monthly" && (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      sx={{
                        fontWeight: 600,
                        bgcolor: "white",
                        fontSize: "0.75rem",
                        "& .MuiSelect-select": {
                          py: 0.5,
                          px: 1,
                        },
                      }}
                    >
                      {months.map((month) => (
                        <MenuItem
                          key={month.value}
                          value={month.value}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                  sx={{
                    bgcolor: "white",
                    "& .MuiToggleButton-root": {
                      fontSize: "0.7rem",
                      px: 1.5,
                      py: 0.4,
                      fontWeight: 600,
                      textTransform: "none",
                    },
                  }}
                >
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                  <ToggleButton value="trends">Trends</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Paper>

          <MetricCards metrics={metrics} loading={loading} viewMode={viewMode} />
          <ErrorAnalysisChart
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            chartData={chartData}
            onGroupSelectionChange={
              viewMode === "monthly" ? fetchChartData : fetchTrendsChartData
            }
            selectedMonth={selectedMonth}
            error={chartError}
            viewMode={viewMode}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModelMonitor;
