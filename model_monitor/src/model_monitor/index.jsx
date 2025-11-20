import React, { useState, useEffect } from "react";
import {
  getAvailableMonths,
  getMetricCards,
  getGroupedMetrics,
} from "../services/modelMonitorService";
import MetricCards from "./rop/MetricCards";
import ErrorAnalysisChart from "./rop/ErrorAnalysisChart";
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

  const fetchChartData = async () => {
    try {
      const response = await getGroupedMetrics(groupBy, selectedMonth);
      const { groupedMetrics } = response.data;
      setChartData({
        categories: groupedMetrics.map((m) => m.groupName),
        aiml: groupedMetrics.map((m) => Number(m.aimlRoMAE.toFixed(2))),
        planned: groupedMetrics.map((m) => Number(m.plannedRoMAE.toFixed(2))),
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h4" fontWeight={700} color="primary">
                Model Monitor Dashboard
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: "white",
                    boxShadow: 2,
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
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModelMonitor;
