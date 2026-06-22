import API from "./axios";

// Total Expense
export const getTotalExpense =
  async () => {
    const response =
      await API.get(
        "/api/v1/finance/total-expense"
      );

    return response.data;
  };

// Total Purchases
export const getTotalPurchases =
  async () => {
    const response =
      await API.get(
        "/api/v1/finance/total-purchases"
      );

    return response.data;
  };

// Recent Purchases
export const getRecentPurchases =
  async () => {
    const response =
      await API.get(
        "/api/v1/finance/recent-purchases"
      );

    return response.data;
  };

// Finance Dashboard
export const getFinanceDashboard =
  async () => {
    const response =
      await API.get(
        "/api/v1/finance/dashboard"
      );

    return response.data;
  };