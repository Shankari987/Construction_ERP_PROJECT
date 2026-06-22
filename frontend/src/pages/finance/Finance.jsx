import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import { AccountBalanceWallet, ShoppingCart, ReceiptLongOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getTotalExpense,
  getTotalPurchases,
  getRecentPurchases,
} from "../../api/financeApi";

import Loader from "../../components/common/Loader";

const FinanceCard = ({ title, value, icon, color, bgColor, unit }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#a0aebb",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              mb: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: "2.2rem", fontWeight: 700, color: "#1c2533", lineHeight: 1.1 }}>
            {unit}{value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            backgroundColor: bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ color, "& svg": { fontSize: 24 } }}>{icon}</Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Finance = () => {
  const [financeData, setFinanceData] = useState({
    totalExpense: 0,
    totalPurchases: 0,
    recentPurchases: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    try {
      const expenseData = await getTotalExpense();
      const purchaseData = await getTotalPurchases();
      const recentData = await getRecentPurchases();

      setFinanceData({
        totalExpense: expenseData.total_expense || 0,
        totalPurchases: purchaseData.total_purchases || 0,
        recentPurchases: recentData || [],
      });
    } catch (error) {
      console.log(error);
      toasterror("Failed To Load Finance Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box>
      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FinanceCard
            title="Total Expense"
            value={Number(financeData.totalExpense).toLocaleString()}
            icon={<AccountBalanceWallet />}
            color="#1a3a5c"
            bgColor="#eaf0f8"
            unit="₹"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FinanceCard
            title="Total Purchases"
            value={financeData.totalPurchases}
            icon={<ShoppingCart />}
            color="#1e8449"
            bgColor="#eaf8f0"
            unit=""
          />
        </Grid>
      </Grid>

    </Box>
  );
};

export default Finance;
