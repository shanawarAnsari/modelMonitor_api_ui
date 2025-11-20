import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import ChartHeader from "./ChartHeader";
import ChartDisplay from "./ChartDisplay";

const ErrorAnalysisChart = ({
  groupBy,
  setGroupBy,
  chartData,
  onGroupSelectionChange,
  selectedMonth,
  error,
  viewMode = "monthly",
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState(chartData);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const maxSelection = 10;

  const allAvailableGroups =
    chartData.allAvailableGroups || chartData.categories || [];
  const totalGroups =
    chartData.totalGroupsCount || chartData.categories?.length || 0;
  const showFilter =
    viewMode === "trends" ? totalGroups > 0 : totalGroups > maxSelection;

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

  return (
    <Card sx={{ borderRadius: 1.5, boxShadow: 1 }}>
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <ChartHeader
          viewMode={viewMode}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          selectedGroups={selectedGroups}
          setSelectedGroups={setSelectedGroups}
          allAvailableGroups={allAvailableGroups}
          totalGroups={totalGroups}
          showFilter={showFilter}
          maxSelection={maxSelection}
        />
        <ChartDisplay
          viewMode={viewMode}
          filteredChartData={filteredChartData}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default ErrorAnalysisChart;
