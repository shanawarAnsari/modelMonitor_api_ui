import React, { useState, useEffect } from "react";
import {
  getAvailableMonths,
  getMetricCards,
  getGroupedMetrics,
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./styles.css";

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

  useEffect(() => {
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchMetricCards();
      fetchChartData();
    }
  }, [selectedMonth, groupBy]);

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
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <MetricCards metrics={metrics} loading={loading} />
          <ErrorAnalysisChart
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            chartData={chartData}
            onGroupSelectionChange={fetchChartData}
            selectedMonth={selectedMonth}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModelMonitor;
