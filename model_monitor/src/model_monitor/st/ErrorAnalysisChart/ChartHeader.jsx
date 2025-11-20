import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

const ChartHeader = ({
  viewMode,
  groupBy,
  setGroupBy,
  selectedGroups,
  setSelectedGroups,
  allAvailableGroups,
  totalGroups,
  showFilter,
  maxSelection,
}) => {
  const groupByOptions = [
    { value: "SETUP_MATRIX", label: "Setup Matrix" },
    { value: "FROM_SETUP_GROUP", label: "From Setup Group" },
    { value: "TO_SETUP_GROUP", label: "To Setup Group" },
    { value: "PLATFORM", label: "Platform" },
    { value: "FACILITY_NAME", label: "Facility Name" },
    { value: "MACHINE", label: "Machine" },
  ];

  const currentGroupLabel =
    groupByOptions.find((opt) => opt.value === groupBy)?.label || groupBy;

  const handleGroupFilterChange = (event) => {
    const value = event.target.value;
    if (value.length <= maxSelection) {
      setSelectedGroups(value);
    }
  };

  return (
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
          {viewMode === "trends"
            ? `Trends Analysis by ${groupBy.replace(/_/g, " ")}`
            : `Error Analysis by ${groupBy.replace(/_/g, " ")}`}
        </Typography>
      </Box>
      <Box display="flex" gap={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              "& .MuiSelect-select": {
                py: 0.5,
                px: 1,
              },
            }}
          >
            {groupByOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "0.75rem", py: 0.75 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showFilter && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              multiple
              displayEmpty
              value={selectedGroups}
              onChange={handleGroupFilterChange}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <FilterListIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                        Select {currentGroupLabel}
                      </Typography>
                    </Box>
                  );
                }
                return (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <FilterListIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                      {selected.length} of {totalGroups} selected
                    </Typography>
                  </Box>
                );
              }}
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                "& .MuiSelect-select": {
                  py: 0.5,
                  px: 1,
                },
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
                  sx={{ fontSize: "0.75rem", py: 0.5 }}
                >
                  <Checkbox
                    checked={selectedGroups.includes(category)}
                    size="small"
                  />
                  <ListItemText
                    primary={category}
                    primaryTypographyProps={{ fontSize: "0.75rem" }}
                  />
                </MenuItem>
              ))}
            </Select>
            {selectedGroups.length >= maxSelection && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem", mt: 0.5 }}
              >
                Max {maxSelection} items can be selected
              </Typography>
            )}
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

export default ChartHeader;
