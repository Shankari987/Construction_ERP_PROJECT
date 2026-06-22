import { useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";

import {
  Inventory,
  People,
  ShoppingCart,
  AccountBalance,
  TrendingDown,
} from "@mui/icons-material";

import DataTable from "../../components/common/DataTable";
import { getDashboardData } from "../../api/dashboardApi";

const StatCard = ({ title, value, icon, color, bgColor, subtitle }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid #dde3ec",
      boxShadow: "0 2px 8px rgba(26,58,92,0.07)",
      overflow: "visible",
      position: "relative",
    }}
  >
    <CardContent sx={{ p: "24px !important" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#a0aebb",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: "2rem", fontWeight: 700, color: "#1c2533", lineHeight: 1.2 }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: "0.75rem", color: "#a0aebb", mt: 0.75 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ color, "& svg": { fontSize: 22 } }}>{icon}</Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const purchaseColumns = [
    { field: "material_name", headerName: "Material" },
    { field: "supplier_name", headerName: "Suppiler" },
    { field: "quantity", headerName: "Quantity" },
    { field: "total_amount", headerName: "Total Amount" },
    { field: "status", headerName: "Status",
      render: (row) => (
  <Chip label="Completed" color="success" size="small" />
),
      
     },
  ];

  if (!dashboardData) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const statCards = [
    {
      title: "Total Materials",
      value: dashboardData.total_materials,
      icon: <Inventory />,
      color: "#1a3a5c",
      bgColor: "#eaf0f8",
    },
    {
      title: "Total Stock",
      value: dashboardData.total_stock,
      icon: <ShoppingCart />,
      color: "#1e8449",
      bgColor: "#eaf8f0",
    },
    {
      title: "Total Expense",
      value: `₹${Number(dashboardData.total_expense).toLocaleString()}`,
      icon: <AccountBalance />,
      color: "#ca6f1e",
      bgColor: "#fef0e6",
    },
    {
      title: "Low Stock Alerts",
      value: dashboardData.low_stock_materials.length,
      icon: <TrendingDown />,
      color: "#c0392b",
      bgColor: "#fdf0ef",
 
    },
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: 3, border: "1px solid #dde3ec", boxShadow: "0 2px 8px rgba(26,58,92,0.07)" }}>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid #f0f3f8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
              Recent Purchases
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#a0aebb", mt: 0.3 }}>
              Latest purchase transactions
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 0 }}>
          <DataTable
            columns={purchaseColumns}
            rows={dashboardData.recent_purchases}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;
