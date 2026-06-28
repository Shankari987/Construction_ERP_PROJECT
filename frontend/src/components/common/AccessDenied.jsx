import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Lock } from "@mui/icons-material";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f7fa",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "#fdf0ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
        }}
      >
        <Lock sx={{ fontSize: 28, color: "#c0392b" }} />
      </Box>

      <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1c2533", mb: 1 }}>
        Access Denied
      </Typography>

      <Typography sx={{ fontSize: "0.9rem", color: "#5d7083", mb: 3 }}>
        You do not have permission to access this page.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          px: 3,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default AccessDenied;