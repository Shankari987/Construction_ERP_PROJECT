import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Alert,
} from "@mui/material";

import {
  PersonOutlined,
  LockOutlined,
  Construction,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginUser(
        formData.username,
        formData.password
      );

      login(data.access_token, data.user);

      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          border: "1px solid #dde3ec",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          backgroundColor: "#fff",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 3,
              backgroundColor: "#1a3a5c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Construction
              sx={{
                color: "#fff",
                fontSize: 30,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1c2533",
            }}
          >
            Mini Construction ERP
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: "0.9rem",
              color: "#6b7280",
            }}
          >
            Sign in to continue
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined
                    sx={{
                      fontSize: 18,
                      color: "#94a3b8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{
                      fontSize: 18,
                      color: "#94a3b8",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.3,
              fontSize: "0.9rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              background:
                "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
              boxShadow: "none",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #0f2236 0%, #1a3a5c 100%)",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;


// import {
//   Box,
//   Button,
//   Paper,
//   TextField,
//   Typography,
//   InputAdornment,
//   Alert,
// } from "@mui/material";

// import { PersonOutlined, LockOutlined, Construction } from "@mui/icons-material";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../api/authApi";
// import { useAuth } from "../../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = await loginUser(formData.username, formData.password);
//       login(data.access_token, data.user);
//       navigate("/");
//     } catch (error) {
//       setError("Invalid username or password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         background: "linear-gradient(135deg, #0f2236 0%, #1a3a5c 50%, #2d5986 100%)",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Background decorative circles */}
//       <Box sx={{
//         position: "absolute", top: -100, right: -100,
//         width: 400, height: 400, borderRadius: "50%",
//         background: "rgba(255,255,255,0.03)", pointerEvents: "none",
//       }} />
//       <Box sx={{
//         position: "absolute", bottom: -150, left: -50,
//         width: 500, height: 500, borderRadius: "50%",
//         background: "rgba(255,255,255,0.03)", pointerEvents: "none",
//       }} />

//       {/* Left Panel - Branding */}
//       <Box
//         sx={{
//           display: { xs: "none", md: "flex" },
//           flex: 1,
//           flexDirection: "column",
//           justifyContent: "center",
//           px: 8,
//           position: "relative",
//           zIndex: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
//           <Box
//             sx={{
//               width: 52,
//               height: 52,
//               borderRadius: 3,
//               background: "rgba(255,255,255,0.15)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid rgba(255,255,255,0.2)",
//             }}
//           >
//             <Construction sx={{ color: "#fff", fontSize: 28 }} />
//           </Box>
//           <Box>
//             <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
//               Construction ERP
//             </Typography>
//             <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>
//               MANAGEMENT SYSTEM
//             </Typography>
//           </Box>
//         </Box>

//         <Typography sx={{ fontSize: "2.5rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, mb: 2 }}>
//           Manage your{" "}
//           <Box component="span" sx={{ color: "#f39c12" }}>
//             projects
//           </Box>{" "}
//           efficiently
//         </Typography>
//         <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 420 }}>
//           Track materials, suppliers, purchases, inventory, and finance all in one unified platform.
//         </Typography>

//         <Box sx={{ display: "flex", gap: 4, mt: 6 }}>
//           {[
//             { label: "Modules", value: "6+" },
//             { label: "Role Types", value: "3" },
//             { label: "Real-time", value: "✓" },
//           ].map((stat) => (
//             <Box key={stat.label}>
//               <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>{stat.value}</Typography>
//               <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 {stat.label}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Right Panel - Login Form */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flex: { xs: 1, md: "0 0 460px" },
//           p: 3,
//           position: "relative",
//           zIndex: 1,
//         }}
//       >
//         <Paper
//           elevation={0}
//           sx={{
//             p: 5,
//             width: "100%",
//             maxWidth: 400,
//             borderRadius: 4,
//             border: "none",
//             boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
//           }}
//         >
//           {/* Mobile logo */}
//           <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 4 }}>
//             <Construction sx={{ color: "#1a3a5c", fontSize: 28 }} />
//             <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1c2533" }}>
//               Construction ERP
//             </Typography>
//           </Box>

//           <Typography variant="h5" sx={{ mb: 0.75 }}>
//             Welcome back
//           </Typography>
//           <Typography sx={{ color: "#a0aebb", fontSize: "0.875rem", mb: 4 }}>
//             Sign in to your account to continue
//           </Typography>

//           {error && (
//             <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: "0.82rem" }}>
//               {error}
//             </Alert>
//           )}

//           <Box component="form" onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Username"
//               name="username"
//               margin="normal"
//               autoComplete="username"
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonOutlined sx={{ fontSize: 18, color: "#a0aebb" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               name="password"
//               margin="normal"
//               autoComplete="current-password"
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockOutlined sx={{ fontSize: 18, color: "#a0aebb" }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Button
//               fullWidth
//               variant="contained"
//               type="submit"
//               disabled={loading}
//               sx={{
//                 mt: 3,
//                 py: 1.4,
//                 fontSize: "0.9rem",
//                 background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
//                 boxShadow: "0 4px 16px rgba(26,58,92,0.35)",
//                 "&:hover": {
//                   background: "linear-gradient(135deg, #0f2236 0%, #1a3a5c 100%)",
//                 },
//               }}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default Login;