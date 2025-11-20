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

const MetricCards = ({ metrics, loading }) => {
  const cards = [
    {
      title: "NUMBER OF PO",
      value: metrics.numberOfPO.toLocaleString(),
      icon: <InventoryIcon sx={{ fontSize: 24 }} />,
      color: "#667eea",
    },
    {
      title: "PLANNED RO - MAE",
      value: metrics.plannedRoMAE,
      icon: <BarChartIcon sx={{ fontSize: 24 }} />,
      color: "#11998e",
    },
    {
      title: "AI ML RO - MAE",
      value: metrics.aimlRoMAE,
      icon: <SmartToyIcon sx={{ fontSize: 24 }} />,
      color: "#a044ff",
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
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default MetricCards;
