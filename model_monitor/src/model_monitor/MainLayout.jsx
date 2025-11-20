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
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import ROPMonitor from "./rop";
import SetupTimeMonitor from "./st";

const DRAWER_WIDTH = 280;
const MINI_DRAWER_WIDTH = 60;

const MainLayout = () => {
  const [selectedSection, setSelectedSection] = useState("rop");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setMobileOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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
          p: drawerOpen ? 2.5 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: drawerOpen ? "space-between" : "center",
        }}
      >
        {drawerOpen && (
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
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <CloseIcon />
        </IconButton>
        <IconButton
          onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          {drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{ mb: 1, px: drawerOpen ? 1.5 : 0.5 }}
          >
            <ListItemButton
              selected={selectedSection === item.id}
              onClick={() => handleSectionChange(item.id)}
              sx={{
                borderRadius: 2,
                transition: "all 0.3s ease",
                justifyContent: drawerOpen ? "flex-start" : "center",
                px: drawerOpen ? 2 : 1,
                "&.Mui-selected": {
                  backgroundColor: `${item.color}15`,
                  borderLeft: drawerOpen ? `4px solid ${item.color}` : "none",
                  "&:hover": {
                    backgroundColor: `${item.color}20`,
                  },
                },
                "&:hover": {
                  backgroundColor: `${item.color}10`,
                  transform: drawerOpen ? "translateX(4px)" : "none",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedSection === item.id ? item.color : "text.secondary",
                  minWidth: drawerOpen ? 40 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: selectedSection === item.id ? 600 : 500,
                    fontSize: "0.95rem",
                    color: selectedSection === item.id ? item.color : "text.primary",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {drawerOpen && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Model Monitor Dashboard v1.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          marginRight: {
            xs: 0,
            sm: drawerOpen ? `${DRAWER_WIDTH}px` : `${MINI_DRAWER_WIDTH}px`,
          },
          transition: "margin-right 0.3s ease",
        }}
      >
        {selectedSection === "rop" ? <ROPMonitor /> : <SetupTimeMonitor />}
      </Box>

      {/* Toggle Button - Desktop - Removed since drawer is always visible */}

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
          display: { xs: "flex", sm: "none" },
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
        anchor="right"
        sx={{
          display: { xs: "none", sm: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
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
          keepMounted: true,
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
    </Box>
  );
};

export default MainLayout;
