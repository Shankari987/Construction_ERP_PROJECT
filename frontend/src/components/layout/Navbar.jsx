import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Breadcrumbs,
} from "@mui/material";

import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const routeLabels = {
  "/": "Dashboard",
  "/materials": "Materials",
  "/materials/add": "Add Material",
  "/suppliers": "Suppliers",
  "/suppliers/add": "Add Supplier",
  "/purchase": "Purchase",
  "/purchase/add": "Add Purchase",
  "/inventory": "Inventory",
  "/inventory/stock-out": "Stock Out",
  "/finance": "Finance",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pathLabel = routeLabels[location.pathname] || "Page";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        color: "#1c2533",
        borderBottom: "1px solid #dde3ec",
        borderRadius: 0,
        boxShadow: "none",
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important", px: 4, gap: 2 }}>
        {/* Page Title */}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1c2533",
              letterSpacing: "-0.2px",
            }}
          >
            {pathLabel}
          </Typography>
          <Breadcrumbs
            sx={{
              "& .MuiBreadcrumbs-separator": { fontSize: "0.65rem", color: "#a0aebb" },
            }}
          >
            <Typography sx={{ fontSize: "0.72rem", color: "#a0aebb" }}>
              Mini Construction ERP
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#5d7083", fontWeight: 500 }}>
              {pathLabel}
            </Typography>
          </Breadcrumbs>
        </Box>
     <Button
        variant="contained"
        startIcon={
          <LogoutOutlined
            sx={{
              fontSize: "1rem !important",
            }}
          />
        }
        onClick={handleLogout}
        sx={{
          mt: 0.1,
          py: 1,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "0.85rem",
          fontWeight: 600,
          background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
          boxShadow: "0 4px 12px rgba(26,58,92,0.18)",
          "&:hover": {
            background: "linear-gradient(135deg, #16324d 0%, #244c73 100%)",
            boxShadow: "0 6px 16px rgba(26,58,92,0.25)",
          },
        }}
      >
        Logout
      </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
