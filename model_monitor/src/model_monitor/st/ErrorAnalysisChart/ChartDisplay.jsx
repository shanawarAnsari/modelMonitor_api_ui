import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import Chart from "react-apexcharts";

const ChartDisplay = ({ viewMode, filteredChartData, error }) => {
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={280}>
        <Alert severity="info" sx={{ fontSize: "0.85rem" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (
    !filteredChartData ||
    (viewMode === "monthly" &&
      (!filteredChartData.categories || filteredChartData.categories.length === 0))
  ) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={280}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  if (viewMode === "monthly") {
    return (
      <>
        <Chart
          key="monthly-chart"
          options={{
            chart: {
              type: "bar",
              toolbar: { show: true },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "70%",
                borderRadius: 4,
              },
            },
            dataLabels: { enabled: false },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            xaxis: {
              categories: filteredChartData.categories || [],
              labels: {
                rotate: -45,
                trim: false,
                style: {
                  fontSize: "11px",
                },
                offsetY: 5,
              },
            },
            yaxis: {
              title: { text: "Mean Absolute Error (MAE) - minutes" },
              labels: { formatter: (val) => val?.toFixed(2) || "0.00" },
            },
            fill: { opacity: 1 },
            tooltip: {
              y: { formatter: (val) => val?.toFixed(4) + " min" || "0.0000 min" },
            },
            colors: ["#a044ff", "#11998e"],
            legend: {
              show: true,
              position: "top",
              horizontalAlign: "center",
            },
            grid: {
              strokeDashArray: 3,
              padding: {
                left: 15,
                right: 15,
                bottom: 15,
              },
            },
          }}
          series={[
            {
              name: "Recommended ST - MAE",
              data: filteredChartData.aiml || [],
            },
            {
              name: "New ST - MAE",
              data: filteredChartData.planned || [],
            },
          ]}
          type="bar"
          height={280}
        />
      </>
    );
  }

  return (
    <>
      <Chart
        key="trends-chart"
        options={{
          chart: {
            type: "line",
            toolbar: { show: true },
            offsetX: 0,
            offsetY: 0,
          },
          stroke: {
            width:
              Array.isArray(filteredChartData.trendsData) &&
              filteredChartData.trendsData.length > 0
                ? filteredChartData.trendsData.flatMap(() => [4, 2])
                : [4, 2],
            curve: "smooth",
            dashArray:
              Array.isArray(filteredChartData.trendsData) &&
              filteredChartData.trendsData.length > 0
                ? filteredChartData.trendsData.flatMap(() => [15, 0])
                : [8, 0],
          },
          colors: [
            "#667eea",
            "#667eea",
            "#f59e0b",
            "#f59e0b",
            "#10b981",
            "#10b981",
            "#ef4444",
            "#ef4444",
            "#8b5cf6",
            "#8b5cf6",
            "#ec4899",
            "#ec4899",
            "#14b8a6",
            "#14b8a6",
            "#f97316",
            "#f97316",
            "#06b6d4",
            "#06b6d4",
            "#84cc16",
            "#84cc16",
          ],
          markers: { size: 4 },
          dataLabels: { enabled: false },
          xaxis: {
            categories:
              filteredChartData.trendsData?.[0]?.trendData?.map(
                (t) => `${t.month} ${t.year}`
              ) || [],
            labels: {
              rotate: -45,
              trim: false,
              style: {
                fontSize: "11px",
              },
              offsetY: 5,
            },
            axisBorder: {
              offsetX: 0,
              offsetY: 0,
            },
          },
          yaxis: {
            title: { text: "Mean Absolute Error (MAE) - minutes" },
            labels: { formatter: (val) => val?.toFixed(2) || "0.00" },
          },
          legend: {
            show: true,
            position: "top",
            horizontalAlign: "center",
            markers: {
              width: 12,
              height: 12,
              strokeWidth: 0,
              strokeColor: "#fff",
              radius: 2,
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: { formatter: (val) => val?.toFixed(4) + " min" || "0.0000 min" },
          },
          grid: {
            strokeDashArray: 3,
            padding: {
              left: 15,
              right: 15,
              bottom: 15,
            },
          },
        }}
        series={(filteredChartData.trendsData || []).flatMap((group) => [
          {
            name: `${group.groupName} - Recommended ST`,
            data: (group.trendData || []).map((t) =>
              Number(t.aimlRoMAE?.toFixed(2) || 0)
            ),
          },
          {
            name: `${group.groupName} - New ST`,
            data: (group.trendData || []).map((t) =>
              Number(t.plannedRoMAE?.toFixed(2) || 0)
            ),
          },
        ])}
        type="line"
        height={280}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={3}
        mt={1.5}
        sx={{
          borderTop: "1px solid #e0e0e0",
          pt: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography
            variant="caption"
            color="text.primary"
            sx={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            Line Style:
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 40,
              height: 3,
              borderTop: "3px dashed #666",
              borderRadius: 0.5,
            }}
          />
          <Typography
            variant="caption"
            color="text.primary"
            sx={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            RECOMMENDED ST - MAE
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 40,
              height: 3,
              bgcolor: "#666",
              borderRadius: 0.5,
            }}
          />
          <Typography
            variant="caption"
            color="text.primary"
            sx={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            NEW ST - MAE
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ChartDisplay;
