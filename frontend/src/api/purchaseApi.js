import API from "./axios";

// Get Purchases
export const getPurchases = async () => {
  const response = await API.get("/api/v1/purchases/");
  return response.data;
};

// Create Purchase
export const createPurchase = async (data) => {
  const response = await API.post("/api/v1/purchases/", data);
  return response.data;
};

// Update Purchase Status
export const updatePurchaseStatus = async (id, status) => {
  const response = await API.put(`/api/v1/purchases/${id}/status`, { status });
  return response.data;
};

// Record Purchase Payment
export const recordPurchasePayment = async (id, amount) => {
  const response = await API.post(`/api/v1/purchases/${id}/payment`, { amount });
  return response.data;
};