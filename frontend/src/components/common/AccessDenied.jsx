import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

const AccessDenied = () => {

  const navigate =
    useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection:
          "column",
        justifyContent:
          "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        color="error"
        mb={2}
      >
        Access Denied
      </Typography>

      <Typography mb={3}>
        You do not have
        permission to access
        this page.
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          navigate("/")
        }
      >
        Go To Dashboard
      </Button>
    </Box>
  );
};

export default AccessDenied;