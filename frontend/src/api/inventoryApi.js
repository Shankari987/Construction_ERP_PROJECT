import API from "./axios";

// Get All Inventory
export const getInventory =
  async () => {

    const response =
      await API.get(
        "/api/v1/inventory/"
      );

    return response.data;
  };

// Get Current Stock
export const getCurrentStock =
  async (materialId) => {

    const response =
      await API.get(
        `/api/v1/inventory/${materialId}`
      );

    return response.data;
  };

// Stock Out
export const stockOutMaterial =
  async (data) => {

    const response =
      await API.post(
        "/api/v1/inventory/stock-out",
        data
      );

    return response.data;
  };

  // Get Stock History
export const getStockHistory =
  async (materialId) => {

    const response =
      await API.get(
        `/api/v1/inventory/history/${materialId}`
      );

    return response.data;
  };