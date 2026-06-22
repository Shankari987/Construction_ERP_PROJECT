import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  // Token
  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

  // User Data
  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      )
    );

  // Login Function
  const login = (
    accessToken,
    userData
  ) => {
    localStorage.setItem(
      "token",
      accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(accessToken);

    setUser(userData);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () =>
  useContext(AuthContext);