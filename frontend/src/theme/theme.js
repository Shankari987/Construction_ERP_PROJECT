import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a3a5c",
      light: "#2d5986",
      dark: "#0f2236",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e67e22",
      light: "#f39c12",
      dark: "#ca6f1e",
      contrastText: "#ffffff",
    },
    success: { main: "#27ae60", light: "#2ecc71", dark: "#1e8449" },
    error: { main: "#c0392b", light: "#e74c3c", dark: "#922b21" },
    warning: { main: "#f39c12", light: "#f1c40f" },
    background: { default: "#f0f3f8", paper: "#ffffff" },
    text: { primary: "#1c2533", secondary: "#5d7083" },
    divider: "#dde3ec",
  },

  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px", color: "#1c2533" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px", color: "#1c2533" },
    h6: { fontWeight: 600, color: "#1c2533" },
    body2: { color: "#5d7083" },
  },

  shape: { borderRadius: 10 },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f0f3f8; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f3f8; }
        ::-webkit-scrollbar-thumb { background: #c5cdd8; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a0aebb; }
      `,
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #dde3ec",
          boxShadow: "0 2px 8px rgba(26,58,92,0.07)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": { boxShadow: "0 6px 24px rgba(26,58,92,0.12)" },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: { padding: "28px", "&:last-child": { paddingBottom: "28px" } },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "9px 20px",
          transition: "all 0.2s ease",
        },
        contained: {
          boxShadow: "0 2px 6px rgba(26,58,92,0.20)",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(26,58,92,0.28)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#dde3ec",
          "&:hover": { borderColor: "#1a3a5c", backgroundColor: "rgba(26,58,92,0.04)" },
        },
        sizeSmall: { padding: "5px 14px", fontSize: "0.8rem" },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fafbfd",
            "& fieldset": { borderColor: "#dde3ec" },
            "&:hover fieldset": { borderColor: "#a0aebb" },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& fieldset": { borderColor: "#1a3a5c", borderWidth: "1.5px" },
            },
          },
          "& .MuiInputLabel-root": {
            color: "#5d7083",
            "&.Mui-focused": { color: "#1a3a5c" },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 14, border: "1px solid #dde3ec" },
        elevation2: { boxShadow: "0 2px 8px rgba(26,58,92,0.07)" },
        elevation3: { boxShadow: "0 4px 16px rgba(26,58,92,0.10)" },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f5f7fa",
            color: "#5d7083",
            fontWeight: 600,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.7px",
            borderBottom: "2px solid #dde3ec",
            padding: "14px 20px",
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            transition: "background 0.15s",
            "&:hover": { backgroundColor: "#f8fafd" },
            "&:last-child .MuiTableCell-body": { borderBottom: "none" },
          },
          "& .MuiTableCell-body": {
            color: "#1c2533",
            fontSize: "0.875rem",
            padding: "14px 20px",
            borderBottom: "1px solid #f0f3f8",
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #dde3ec",
          boxShadow: "0 2px 8px rgba(26,58,92,0.06)",
          overflow: "hidden",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: "0.75rem", height: 26 },
        colorSuccess: { backgroundColor: "#eaf8f0", color: "#1e8449" },
        colorError: { backgroundColor: "#fdf0ef", color: "#c0392b" },
        colorWarning: { backgroundColor: "#fef9ec", color: "#ca6f1e" },
      },
    },

    MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
    MuiDivider: { styleOverrides: { root: { borderColor: "#dde3ec" } } },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 10, margin: "2px 0", transition: "all 0.15s ease" },
      },
    },
  },
});

export default theme;
