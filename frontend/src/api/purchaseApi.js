import API from "./axios";

// Get Purchases
export const getPurchases =
  async () => {

    const response =
      await API.get(
        "/api/v1/purchases/"
      );

    return response.data;
  };

// Create Purchase
export const createPurchase =
  async (data) => {

    const response =
      await API.post(
        "/api/v1/purchases/",
        data
      );

    return response.data;
  };