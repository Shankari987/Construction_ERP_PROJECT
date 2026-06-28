import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  Button,
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  AccountBalance,
  TrendingDown,
  Warning,
  Circle,
} from "@mui/icons-material";
import { getDashboardData } from "../../api/dashboardApi";

const StatCard = ({ title, value, icon, color, bgColor, subtitle }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid #dde3ec",
      boxShadow: "0 2px 8px rgba(26,58,92,0.05)",
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
            sx={{ fontSize: "1.8rem", fontWeight: 700, color: "#1c2533", lineHeight: 1.2 }}
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
  const navigate = useNavigate();
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

  if (!dashboardData) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item key={i} xs={12} sm={6} md={3}>
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
      subtitle: "Active Catalog Items"
    },
    {
      title: "Total Stock Items",
      value: dashboardData.total_stock,
      icon: <ShoppingCart />,
      color: "#1e8449",
      bgColor: "#eaf8f0",
      subtitle: "Available on Hand"
    },
    {
      title: "Total Committed",
      value: `₹${Number(dashboardData.total_expense).toLocaleString()}`,
      icon: <AccountBalance />,
      color: "#ca6f1e",
      bgColor: "#fef0e6",
      subtitle: "Procurement Volume"
    },
    {
      title: "Low Stock Alerts",
      value: dashboardData.low_stock_materials.length,
      icon: <TrendingDown />,
      color: "#c0392b",
      bgColor: "#fdf0ef",
      subtitle: "Needs Immediate Order"
    },
  ];

  // Colors for Purchase workflow
  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "pending": color = "warning"; break;
      case "approved": color = "info"; break;
      case "delivered": color = "success"; break;
      case "cancelled": color = "error"; break;
    }
    return <Chip label={status} color={color} size="small" sx={{ fontWeight: 600, textTransform: "capitalize" }} />;
  };

  // Colors for payment
  const getPaymentChip = (payment_status) => {
    let color = "default";
    switch (payment_status) {
      case "unpaid": color = "error"; break;
      case "partially_paid": color = "warning"; break;
      case "paid": color = "success"; break;
    }
    return <Chip label={payment_status.replace("_", " ")} color={color} size="small" variant="outlined" sx={{ fontWeight: 600, textTransform: "capitalize" }} />;
  };

  return (
    <Box>
      {/* Top metrics summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Visual Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Stock Level Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #dde3ec", boxShadow: "0 2px 8px rgba(26,58,92,0.05)", height: "100%" }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f3f8" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
                Stock Levels vs Safety Minimums
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "#a0aebb" }}>
                Comparison of active warehouse stocks
              </Typography>
            </Box>
            <CardContent sx={{ py: 4 }}>
              {dashboardData.stock_breakdown.length === 0 ? (
                <Typography color="textSecondary" align="center">No stock breakdown available</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {dashboardData.stock_breakdown.slice(0, 5).map((item) => {
                    const maxVal = Math.max(item.available_stock, item.minimum_stock, 10);
                    const availableWidth = (item.available_stock / maxVal) * 100;
                    const minWidth = (item.minimum_stock / maxVal) * 100;
                    const isLow = item.available_stock < item.minimum_stock;

                    return (
                      <Box key={item.material_name}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography sx={{ fontSize: "0.825rem", fontWeight: 600, color: "#1c2533" }}>
                            {item.material_name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.825rem", fontWeight: 700, color: isLow ? "#c0392b" : "#1e8449" }}>
                            {item.available_stock} Available / Min {item.minimum_stock}
                          </Typography>
                        </Box>
                        <Box sx={{ position: "relative", height: 8, bgcolor: "#f0f3f8", borderRadius: 4, overflow: "hidden" }}>
                          <Box 
                            sx={{ 
                              position: "absolute", 
                              left: 0, 
                              top: 0, 
                              height: "100%", 
                              width: `${minWidth}%`, 
                              bgcolor: "#dde3ec", 
                              zIndex: 1 
                            }} 
                          />
                          <Box 
                            sx={{ 
                              position: "absolute", 
                              left: 0, 
                              top: 0, 
                              height: "100%", 
                              width: `${availableWidth}%`, 
                              bgcolor: isLow ? "#c0392b" : "#1e8449", 
                              zIndex: 2,
                              borderRadius: 4
                            }} 
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trend Area Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #dde3ec", boxShadow: "0 2px 8px rgba(26,58,92,0.05)", height: "100%" }}>
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f3f8" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
                Monthly Expenditure Trend
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "#a0aebb" }}>
                Purchase orders vs actual cash outflow
              </Typography>
            </Box>
            <CardContent sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {dashboardData.monthly_trend.length === 0 ? (
                <Typography color="textSecondary" align="center">No trend data available</Typography>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <svg viewBox="0 0 500 200" width="100%" height="180">
                    <defs>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a3a5c" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1a3a5c" stopOpacity="0.00" />
                      </linearGradient>
                      <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e8449" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1e8449" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f0f3f8" strokeWidth="1" />
                    <line x1="40" y1="75" x2="480" y2="75" stroke="#f0f3f8" strokeWidth="1" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="#f0f3f8" strokeWidth="1" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#dde3ec" strokeWidth="1.5" />

                    {(() => {
                      const trend = dashboardData.monthly_trend;
                      const maxVal = Math.max(...trend.map(d => Math.max(d.expense, d.paid)), 1000);
                      const widthBetween = 440 / (trend.length - 1 || 1);

                      const expensePoints = trend.map((d, i) => {
                        const x = 40 + i * widthBetween;
                        const y = 170 - (d.expense / maxVal) * 140;
                        return { x, y };
                      });

                      const paidPoints = trend.map((d, i) => {
                        const x = 40 + i * widthBetween;
                        const y = 170 - (d.paid / maxVal) * 140;
                        return { x, y };
                      });

                      const expensePath = `M ${expensePoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                      const expenseAreaPath = `${expensePath} L ${expensePoints[expensePoints.length - 1].x} 170 L ${expensePoints[0].x} 170 Z`;

                      const paidPath = `M ${paidPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                      const paidAreaPath = `${paidPath} L ${paidPoints[paidPoints.length - 1].x} 170 L ${paidPoints[0].x} 170 Z`;

                      return (
                        <>
                          <path d={expenseAreaPath} fill="url(#expenseGrad)" />
                          <path d={paidAreaPath} fill="url(#paidGrad)" />

                          <path d={expensePath} fill="none" stroke="#1a3a5c" strokeWidth="2.5" />
                          <path d={paidPath} fill="none" stroke="#1e8449" strokeWidth="2.5" />

                          {trend.map((d, i) => {
                            const expP = expensePoints[i];
                            const paidP = paidPoints[i];
                            return (
                              <g key={d.month}>
                                <circle cx={expP.x} cy={expP.y} r="3.5" fill="#1a3a5c" />
                                <circle cx={paidP.x} cy={paidP.y} r="3.5" fill="#1e8449" />
                                <text x={expP.x} y="188" fontSize="9" textAnchor="middle" fill="#a0aebb" fontWeight="600">
                                  {d.month}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Circle sx={{ color: "#1a3a5c", fontSize: 10 }} />
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#5d7083" }}>Purchase Volume</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Circle sx={{ color: "#1e8449", fontSize: 10 }} />
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#5d7083" }}>Actual Cash Outflow</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Purchases Detailed Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #dde3ec", boxShadow: "0 2px 8px rgba(26,58,92,0.05)" }}>
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
                  Latest procurement transactions
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate("/purchase")}
                sx={{ borderRadius: 2, fontSize: "0.75rem", fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>
            <Box sx={{ p: 0, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0f3f8", backgroundColor: "#fafbfc" }}>
                    <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Material</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Supplier</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Total Amount</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Workflow</th>
                    <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recent_purchases.slice(0, 5).map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f0f3f8" }}>
                      <td style={{ padding: "12px 16px", fontSize: "0.825rem", fontWeight: 600, color: "#1c2533" }}>{p.material_name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#5d7083" }}>{p.supplier_name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#1c2533" }}>₹{Number(p.total_amount).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>{getStatusChip(p.status)}</td>
                      <td style={{ padding: "12px 16px" }}>{getPaymentChip(p.payment_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Grid>

        {/* Low Stock Alerts Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #dde3ec", boxShadow: "0 2px 8px rgba(26,58,92,0.05)" }}>
            <Box sx={{ px: 3, py: 2.2, borderBottom: "1px solid #f0f3f8", bgcolor: "#fdf0ef" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Warning sx={{ color: "#c0392b", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#c0392b" }}>
                  Low Stock Alerts
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ py: 2 }}>
              {dashboardData.low_stock_materials.length === 0 ? (
                <Typography color="textSecondary" align="center" sx={{ py: 2 }}>All materials are at safe stock levels.</Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {dashboardData.low_stock_materials.map((m) => (
                    <Box
                      key={m.material_name}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#fafbfc",
                        border: "1px solid #f0f3f8"
                      }}
                    >
                      <Typography sx={{ fontSize: "0.825rem", fontWeight: 700, color: "#1c2533" }}>
                        {m.material_name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#c0392b", fontWeight: 600, mt: 0.3 }}>
                        Available: {m.available_stock} &nbsp;|&nbsp; Min: {m.minimum_stock}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
