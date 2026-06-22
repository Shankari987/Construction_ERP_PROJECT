import API from "./axios";

// Dashboard Data
export const getDashboardData =
  async () => {
    const response = await API.get(
      "/api/v1/dashboard/"
    );

    return response.data;
  };0