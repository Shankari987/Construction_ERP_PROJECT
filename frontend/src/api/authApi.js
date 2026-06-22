import API from "./axios";

// Register
export const registerUser =
  async (data) => {
    const response =
      await API.post(
        "/api/v1/register",
        data
      );

    return response.data;
  };

// Login
export const loginUser =
  async (username, password) => {
    const params =
      new URLSearchParams();

    params.append(
      "username",
      username
    );

    params.append(
      "password",
      password
    );

    const response =
      await API.post(
        "/api/v1/login",
        params,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    return response.data;
  };