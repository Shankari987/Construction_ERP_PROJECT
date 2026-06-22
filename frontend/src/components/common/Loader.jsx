import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={3.5}
        sx={{ color: "#1a3a5c" }}
      />
      <Typography sx={{ fontSize: "0.85rem", color: "#a0aebb" }}>{message}</Typography>
    </Box>
  );
};

export default Loader;
