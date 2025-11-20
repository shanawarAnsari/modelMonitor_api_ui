import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const ErrorAnalysisChart = ({
  groupBy,
  setGroupBy,
  chartData,
  onGroupSelectionChange,
  selectedMonth,
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState(chartData);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const maxSelection = 10;
  const groupByOptions = [
    { value: "INTERFACE", label: "Interface" },
    { value: "PLATFORM", label: "Platform" },
    { value: "FACILITY_NAME", label: "Facility Name" },
    { value: "MACHINE", label: "Machine" },
    { value: "BUSINESS_UNIT", label: "Business Unit" },
    { value: "CATEGORY", label: "Category" },
  ];

  const allAvailableGroups =
    chartData.allAvailableGroups || chartData.categories || [];
  const totalGroups =
    chartData.totalGroupsCount || chartData.categories?.length || 0;
  const showFilter = totalGroups > maxSelection;

  // Get the current group label for display
  const currentGroupLabel =
    groupByOptions.find((opt) => opt.value === groupBy)?.label || groupBy;

  // Reset selected groups when groupBy changes
  useEffect(() => {
    setSelectedGroups([]);
  }, [groupBy]);

  // Update filtered chart data directly from API response
  useEffect(() => {
    setFilteredChartData(chartData);
  }, [chartData]);

  // Fetch new data when selected groups change (only if user has selected something)
  useEffect(() => {
    const fetchFilteredData = async () => {
      // Only fetch if user has explicitly selected groups
      if (selectedGroups.length > 0 && onGroupSelectionChange) {
        setIsLoadingFilter(true);
        await onGroupSelectionChange(selectedGroups);
        setIsLoadingFilter(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const timer = setTimeout(() => {
      fetchFilteredData();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedGroups]);

  const handleGroupFilterChange = (event) => {
    const value = event.target.value;
    if (value.length <= maxSelection) {
      setSelectedGroups(value);
    }
  };
  return (
    <Card sx={{ borderRadius: 1.5, boxShadow: 1 }}>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
          flexWrap="wrap"
          gap={1.5}
        >
          <Box display="flex" alignItems="center" gap={0.75}>
            <BarChartIcon color="primary" sx={{ fontSize: 18 }} />
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="primary"
              sx={{ fontSize: "0.9rem" }}
            >
              Error Analysis by {groupBy.replace("_", " ")}
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                {groupByOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {showFilter && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  multiple
                  value={selectedGroups}
                  onChange={handleGroupFilterChange}
                  renderValue={(selected) => (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <FilterListIcon sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                        {selected.length === 0
                          ? `Top 10 of ${totalGroups}`
                          : `${selected.length} of ${totalGroups} groups`}
                      </Typography>
                    </Box>
                  )}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {allAvailableGroups.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                      disabled={
                        !selectedGroups.includes(category) &&
                        selectedGroups.length >= maxSelection
                      }
                      sx={{ fontSize: "0.85rem" }}
                    >
                      <Checkbox
                        checked={selectedGroups.includes(category)}
                        size="small"
                      />
                      <ListItemText
                        primary={category}
                        primaryTypographyProps={{ fontSize: "0.85rem" }}
                      />
                    </MenuItem>
                  ))}
                </Select>
                {selectedGroups.length >= maxSelection && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem", mt: 0.5 }}
                  >
                    Max {maxSelection} items can be selected
                  </Typography>
                )}
              </FormControl>
            )}
          </Box>
        </Box>
        <Chart
          options={{
            chart: { type: "bar", toolbar: { show: true } },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "70%",
                dataLabels: { position: "top" },
              },
            },
            dataLabels: {
              enabled: true,
              formatter: (val) => val.toFixed(2),
              offsetY: -20,
              style: { fontSize: "12px", colors: ["#333"] },
            },
            xaxis: {
              categories: filteredChartData.categories,
              labels: { rotate: -45, trim: true },
            },
            yaxis: {
              title: { text: "Mean Absolute Error (MAE)" },
              labels: { formatter: (val) => val.toFixed(2) },
            },
            colors: ["#667eea", "#f59e0b"],
            legend: { position: "top", horizontalAlign: "center" },
            tooltip: {
              shared: true,
              intersect: false,
              y: { formatter: (val) => val.toFixed(4) },
            },
            grid: { strokeDashArray: 3 },
          }}
          series={[
            { name: "AI ML RO - MAE", data: filteredChartData.aiml },
            { name: "PLANNED RO - MAE", data: filteredChartData.planned },
          ]}
          type="bar"
          height={280}
        />
      </CardContent>
    </Card>
  );
};

export default ErrorAnalysisChart;
