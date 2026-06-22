import { Box, Typography, Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

const PageHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        mb: 3.5,
        pb: 3,
        borderBottom: "1px solid #dde3ec",
      }}
    >
      {buttonText && (
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={onButtonClick}
          sx={{
            background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
            px: 2.5,
            py: 1.1,
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(26,58,92,0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #0f2236 0%, #1a3a5c 100%)",
              boxShadow: "0 6px 18px rgba(26,58,92,0.35)",
              transform: "translateY(-1px)",
              
            },
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
