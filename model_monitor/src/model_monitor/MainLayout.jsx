import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ROPMonitor from "./rop";
import SetupTimeMonitor from "./st";

const DRAWER_WIDTH = 280;

const MainLayout = () => {
  const [selectedSection, setSelectedSection] = useState("rop");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setMobileOpen(false);
  };

  const menuItems = [
    {
      id: "rop",
      label: "Rate of Operations",
      icon: <SpeedIcon />,
      color: "#667eea",
    },
    {
      id: "st",
      label: "Setup Time",
      icon: <TimerIcon />,
      color: "#667eea",
    },
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Model Monitor
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1, px: 1.5 }}>
            <ListItemButton
              selected={selectedSection === item.id}
              onClick={() => handleSectionChange(item.id)}
              sx={{
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  backgroundColor: `${item.color}15`,
                  borderLeft: `4px solid ${item.color}`,
                  "&:hover": {
                    backgroundColor: `${item.color}20`,
                  },
                },
                "&:hover": {
                  backgroundColor: `${item.color}10`,
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedSection === item.id ? item.color : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selectedSection === item.id ? 600 : 500,
                  fontSize: "0.95rem",
                  color: selectedSection === item.id ? item.color : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Model Monitor Dashboard v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
          display: { sm: "none" },
          bgcolor: "white",
          boxShadow: 2,
          "&:hover": {
            bgcolor: "white",
            boxShadow: 4,
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
        }}
      >
        {selectedSection === "rop" ? <ROPMonitor /> : <SetupTimeMonitor />}
      </Box>
    </Box>
  );
};

export default MainLayout;
