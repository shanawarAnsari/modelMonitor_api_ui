import React from "react";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  BarChart as BarChartIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";

const MetricCards = ({ metrics, loading, viewMode = "monthly" }) => {
  const sparkChartsData = metrics.sparkChartsData || {};

  const cards = [
    {
      title: viewMode === "trends" ? "TOTAL PO" : "NUMBER OF PO",
      value: metrics.numberOfPO?.toLocaleString() || 0,
      icon: <InventoryIcon sx={{ fontSize: 24 }} />,
      color: "#667eea",
      sparkData: sparkChartsData.numberOfPO?.data || [],
      sparkCategories: sparkChartsData.numberOfPO?.categories || [],
    },
    {
      title:
        viewMode === "trends" ? "AVG RECOMMENDED ST - MAE" : "RECOMMENDED ST - MAE",
      value: metrics.aimlRoMAE || 0,
      unit: "min",
      icon: <SmartToyIcon sx={{ fontSize: 24 }} />,
      color: "#a044ff",
      sparkData: sparkChartsData.aimlRoMAE?.data || [],
      sparkCategories: sparkChartsData.aimlRoMAE?.categories || [],
    },
    {
      title: viewMode === "trends" ? "AVG NEW ST - MAE" : "NEW ST - MAE",
      value: metrics.plannedRoMAE || 0,
      unit: "min",
      icon: <BarChartIcon sx={{ fontSize: 24 }} />,
      color: "#11998e",
      sparkData: sparkChartsData.plannedRoMAE?.data || [],
      sparkCategories: sparkChartsData.plannedRoMAE?.categories || [],
    },
  ];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ width: "100%", mb: 1.5 }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            background: "white",
            border: `1px solid ${card.color}30`,
            transition: "all 0.2s ease",
            borderRadius: 1.5,
            flex: 1,
            "&:hover": {
              boxShadow: 2,
              borderColor: card.color,
            },
          }}
        >
          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  color: "white",
                  bgcolor: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  p: 0.75,
                  minWidth: 40,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>
              <Box flex={1} minWidth={0}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{
                    fontSize: "0.65rem",
                    letterSpacing: 0.3,
                    display: "block",
                  }}
                >
                  {card.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box display="flex" alignItems="baseline" gap={0.5}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ color: card.color, lineHeight: 1.2 }}
                    >
                      {loading ? (
                        <CircularProgress size={18} sx={{ color: card.color }} />
                      ) : (
                        card.value
                      )}
                    </Typography>
                    {card.unit && !loading && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: card.color,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          opacity: 0.8,
                        }}
                      >
                        {card.unit}
                      </Typography>
                    )}
                  </Box>
                  {viewMode === "trends" &&
                    !loading &&
                    card.sparkData.length > 0 && (
                      <Box sx={{ width: 80, height: 30, ml: "auto" }}>
                        <Chart
                          options={{
                            chart: {
                              type: "line",
                              sparkline: { enabled: true },
                              animations: { enabled: false },
                            },
                            stroke: { width: 2, curve: "smooth" },
                            colors: [card.color],
                            tooltip: {
                              enabled: true,
                              fixed: { enabled: false },
                              x: { show: true },
                              y: {
                                title: {
                                  formatter: () => "",
                                },
                              },
                              marker: { show: false },
                            },
                            xaxis: {
                              categories: card.sparkCategories,
                            },
                          }}
                          series={[
                            {
                              name: "Trend",
                              data: card.sparkData,
                            },
                          ]}
                          type="line"
                          height={30}
                          width={80}
                        />
                      </Box>
                    )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default MetricCards;
