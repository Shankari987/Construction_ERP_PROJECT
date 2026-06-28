import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ShoppingCart,
  ReceiptLong,
  HourglassEmpty,
  Payment,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getFinanceDashboard } from "../../api/financeApi";
import { recordPurchasePayment } from "../../api/purchaseApi";
import Loader from "../../components/common/Loader";

const FinanceCard = ({ title, value, icon, color, bgColor, subtitle }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid #dde3ec",
      boxShadow: "0 2px 8px rgba(26,58,92,0.05)",
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
          <Typography sx={{ fontSize: "2rem", fontWeight: 700, color: "#1c2533", lineHeight: 1.2 }}>
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

const Finance = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const fetchFinanceData = async () => {
    try {
      const data = await getFinanceDashboard();
      setDashboardData(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load finance dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleOpenPaymentModal = (purchase) => {
    setSelectedPurchase(purchase);
    const remaining = Math.max(0, purchase.total_amount - purchase.amount_paid);
    setPaymentAmount(remaining.toFixed(2));
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedPurchase(null);
    setPaymentAmount("");
  };

  const handleRecordPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.warning("Please enter a valid payment amount");
      return;
    }

    const remaining = Math.max(0, selectedPurchase.total_amount - selectedPurchase.amount_paid);
    if (amount > remaining + 0.01) {
      toast.error(`Payment cannot exceed outstanding balance of ₹${remaining.toLocaleString()}`);
      return;
    }

    try {
      await recordPurchasePayment(selectedPurchase.id, amount);
      toast.success("Payment recorded successfully");
      handleClosePaymentModal();
      setLoading(true);
      fetchFinanceData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to record payment");
    }
  };

  if (loading || !dashboardData) return <Loader />;

  // Group expenses by material for the Donut Chart
  const materialExpenses = {};
  dashboardData.recent_purchases.forEach((p) => {
    materialExpenses[p.material_name] = (materialExpenses[p.material_name] || 0) + p.total_amount;
  });

  const totalExpenseVal = dashboardData.total_expense || 1; // avoid divide by zero
  const donutData = Object.keys(materialExpenses).map((name, index) => {
    const value = materialExpenses[name];
    const percent = (value / totalExpenseVal) * 100;
    const colors = ["#1a3a5c", "#2d5986", "#1e8449", "#ca6f1e", "#c0392b", "#8e44ad", "#16a085"];
    return {
      name,
      value,
      percent,
      color: colors[index % colors.length]
    };
  });

  const unpaidPurchases = dashboardData.recent_purchases.filter(
    (p) => p.payment_status !== "paid"
  );

  const getPaymentStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "unpaid":
        color = "error";
        break;
      case "partially_paid":
        color = "warning";
        break;
      case "paid":
        color = "success";
        break;
    }
    return (
      <Chip 
        label={status.replace("_", " ")} 
        color={color} 
        size="small" 
        variant="outlined" 
        sx={{ fontWeight: 600, textTransform: "capitalize" }} 
      />
    );
  };

  return (
    <Box>
      {/* Financial Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceCard
            title="Total Expense"
            value={`₹${Number(dashboardData.total_expense).toLocaleString()}`}
            icon={<ShoppingCart />}
            color="#1a3a5c"
            bgColor="#eaf0f8"
            subtitle="Committed Purchase Volume"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceCard
            title="Cash Paid"
            value={`₹${Number(dashboardData.total_paid).toLocaleString()}`}
            icon={<AccountBalanceWallet />}
            color="#1e8449"
            bgColor="#eaf8f0"
            subtitle="Actual Cash Outflows"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceCard
            title="Accounts Payable"
            value={`₹${Number(dashboardData.accounts_payable).toLocaleString()}`}
            icon={<HourglassEmpty />}
            color="#ca6f1e"
            bgColor="#fef0e6"
            subtitle="Outstanding Supplier Debts"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FinanceCard
            title="Purchase Orders"
            value={dashboardData.total_purchases}
            icon={<ReceiptLong />}
            color="#8e44ad"
            bgColor="#f4ebf8"
            subtitle="Total Procurement Orders"
          />
        </Grid>
      </Grid>

      {/* Visual Charts & Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              border: "1px solid #dde3ec", 
              boxShadow: "0 2px 8px rgba(26,58,92,0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f3f8" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
                Expense Breakdown
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: "#a0aebb" }}>
                Expenditure share by material type
              </Typography>
            </Box>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, py: 4 }}>
              {donutData.length === 0 ? (
                <Typography color="textSecondary">No expense data available</Typography>
              ) : (
                <Box sx={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
                  {/* SVG Donut Chart */}
                  <Box sx={{ position: "relative", width: 160, height: 160 }}>
                    <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                      <circle className="donut-hole" cx="21" cy="21" r="15.915" fill="#fff"></circle>
                      <circle className="donut-ring" cx="21" cy="21" r="15.915" fill="transparent" stroke="#f0f3f8" strokeWidth="3.5"></circle>
                      
                      {(() => {
                        let accumulatedPercent = 0;
                        return donutData.map((item, i) => {
                          const strokeDasharray = `${item.percent} ${100 - item.percent}`;
                          const strokeDashoffset = 100 - accumulatedPercent + 25; // start at top (12 o'clock)
                          accumulatedPercent += item.percent;
                          return (
                            <circle
                              key={item.name}
                              cx="21"
                              cy="21"
                              r="15.915"
                              fill="transparent"
                              stroke={item.color}
                              strokeWidth="3.8"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                            />
                          );
                        });
                      })()}
                    </svg>
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        top: "50%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)", 
                        textAlign: "center" 
                      }}
                    >
                      <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#a0aebb", textTransform: "uppercase" }}>
                        Total
                      </Typography>
                      <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1c2533" }}>
                        ₹{(dashboardData.total_expense / 1000).toFixed(1)}k
                      </Typography>
                    </Box>
                  </Box>

                  {/* Donut Chart Legend */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {donutData.map((item) => (
                      <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: item.color }} />
                        <Typography sx={{ fontSize: "0.8rem", color: "#1c2533", fontWeight: 500 }}>
                          {item.name} ({item.percent.toFixed(0)}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Outstanding Payables Table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #dde3ec",
              boxShadow: "0 2px 8px rgba(26,58,92,0.05)",
              height: "100%",
            }}
          >
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #f0f3f8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
                  Outstanding Payables
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "#a0aebb" }}>
                  Unpaid and partially-paid supplier invoices
                </Typography>
              </Box>
              {unpaidPurchases.length > 0 && (
                <Chip
                  label={`${unpaidPurchases.length} pending`}
                  color="warning"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>

            <Box sx={{ maxHeight: 380, overflowY: "auto", overflowX: "auto" }}>
              {unpaidPurchases.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="textSecondary">All supplier invoices are fully paid. ✅</Typography>
                </Box>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f3f8", backgroundColor: "#fafbfc" }}>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Material</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Supplier</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Invoice #</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Total</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Outstanding</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Status</th>
                      <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: 600, color: "#5d7083" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidPurchases.map((p) => {
                      const owed = Math.max(0, p.total_amount - p.amount_paid);
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f0f3f8" }}>
                          <td style={{ padding: "12px 16px", fontSize: "0.825rem", fontWeight: 600, color: "#1c2533" }}>{p.material_name}</td>
                          <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#5d7083" }}>{p.supplier_name}</td>
                          <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#5d7083" }}>{p.invoice_number || `PO-${String(p.id).padStart(4, "0")}`}</td>
                          <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#1c2533" }}>₹{Number(p.total_amount).toLocaleString()}</td>
                          <td style={{ padding: "12px 16px", fontSize: "0.825rem", color: "#c0392b", fontWeight: 700 }}>₹{owed.toLocaleString()}</td>
                          <td style={{ padding: "12px 16px" }}>{getPaymentStatusChip(p.payment_status)}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<Payment />}
                              onClick={() => handleOpenPaymentModal(p)}
                              sx={{ py: 0.25, px: 1.5, fontSize: "0.72rem", borderRadius: 1.5, boxShadow: "none" }}
                            >
                              Pay
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Record Payment Dialog */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={handleClosePaymentModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Record Payment</DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Supplier:</strong> {selectedPurchase.supplier_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Material:</strong> {selectedPurchase.material_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                <strong>Invoice :</strong> {selectedPurchase.invoice_number || `PO-${String(selectedPurchase.id).padStart(4, "0")}`}
              </Typography>

              <Box 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  borderRadius: 2, 
                  bgcolor: "#f5f7fa",
                  border: "1px solid #eef1f6"
                }}
              >
                <GridBox label="Total Amount" value={`₹${Number(selectedPurchase.total_amount).toLocaleString()}`} />
                <GridBox label="Amount Already Paid" value={`₹${Number(selectedPurchase.amount_paid).toLocaleString()}`} />
                <GridBox 
                  label="Remaining Balance" 
                  value={`₹${Math.max(0, selectedPurchase.total_amount - selectedPurchase.amount_paid).toLocaleString()}`} 
                  highlight
                />
              </Box>

              <TextField
                autoFocus
                fullWidth
                label="Payment Amount (₹)"
                type="number"
                variant="outlined"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                inputProps={{ min: 0.01, step: "any" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClosePaymentModal} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={handleRecordPayment} 
            variant="contained" 
            color="primary"
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Submit Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Simple visual row helper for modal
const GridBox = ({ label, value, highlight }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, "&:last-child": { mb: 0 } }}>
    <Typography variant="body2" color={highlight ? "primary" : "textSecondary"} sx={{ fontWeight: highlight ? 700 : 500 }}>
      {label}
    </Typography>
    <Typography variant="body2" color={highlight ? "primary" : "textPrimary"} sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

export default Finance;
