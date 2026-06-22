import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
} from "@mui/material";

import {
  Dashboard,
  Inventory2,
  People,
  ShoppingCart,
  AccountBalance,
  Construction,
  LogoutOutlined,
} from "@mui/icons-material";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Dashboard fontSize="small" />,
      path: "/",
      roles: ["admin", "manager", "site_engineer"],
    },
    {
      name: "Materials",
      icon: <Inventory2 fontSize="small" />,
      path: "/materials",
      roles: ["admin", "manager", "site_engineer"],
    },
    {
      name: "Suppliers",
      icon: <People fontSize="small" />,
      path: "/suppliers",
      roles: ["admin"],
    },
    {
      name: "Purchase",
      icon: <ShoppingCart fontSize="small" />,
      path: "/purchase",
      roles: ["admin", "manager"],
    },
    {
      name: "Inventory",
      icon: <Inventory2 fontSize="small" />,
      path: "/inventory",
      roles: ["admin", "manager", "site_engineer"],
    },
    {
      name: "Finance",
      icon: <AccountBalance fontSize="small" />,
      path: "/finance",
      roles: ["admin", "manager"],
    },
  ];

  const roleColors = {
    admin: { bg: "#fef0e6", color: "#ca6f1e" },
    manager: { bg: "#eaf4fd", color: "#1a6fa8" },
    site_engineer: { bg: "#eafaf1", color: "#1e8449" },
  };
  const rc = roleColors[user?.role] || { bg: "#f0f3f8", color: "#5d7083" };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          borderRadius:0,
          borderRight: "1px solid #dde3ec",
          boxShadow: "2px 0 12px rgba(26,58,92,0.06)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: 3,
          borderBottom: "1px solid #f0f3f8",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 10px rgba(26,58,92,0.25)",
            }}
          >
            <Construction sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.92rem",
                color: "#1c2533",
                lineHeight: 1.2,
                letterSpacing: "-0.2px",
              }}
            >
            Mini Construction
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#5d7083",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              ERP SYSTEM
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, p: 2, pt: 2.5 }}>
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 600,
            color: "#a0aebb",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            px: 1.5,
            mb: 1,
          }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {menuItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      borderRadius: 2.5,
                      px: 1.5,
                      py: 1.1,
                      backgroundColor: isActive
                        ? "rgba(26,58,92,0.08)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "rgba(26,58,92,0.10)"
                          : "#f5f7fa",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? "#1a3a5c" : "#8899aa",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#1a3a5c" : "#3d5166",
                      }}
                    />
                    {isActive && (
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          backgroundColor: "#1a3a5c",
                          mr: 0.5,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
      </Box>
      {/* User Info */}
      <Box sx={{ p: 2, borderTop: "1px solid #f0f3f8" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#f8fafd",
            border: "1px solid #eef1f6",
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: "#1a3a5c",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {user?.role?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#1c2533",
                lineHeight: 1.3,
              }}
            >
              {user?.username || "User"}
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                px: 1,
                py: 0.2,
                borderRadius: 1,
                backgroundColor: rc.bg,
                mt: 0.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: rc.color,
                  textTransform: "capitalize",
                }}
              >
                {user?.role?.replace("_", " ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
