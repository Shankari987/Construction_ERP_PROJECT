// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import {
//   Box,
//   Chip,
//   Typography,
//   Paper,
//   Divider,
//   Button,
// } from "@mui/material";

// import { ArrowBackOutlined } from "@mui/icons-material";

// import Loader from "../../components/common/Loader";
// import DataTable from "../../components/common/DataTable";
// import { getStockHistory } from "../../api/inventoryApi";

// const StockHistory = () => {
//   const { materialId } = useParams();

//   const navigate = useNavigate();

//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const data = await getStockHistory(materialId);

//       setHistory(data.history);
//     } catch (error) {
//       console.log(error);
//       alert("Failed To Fetch History");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       field: "type",
//       headerName: "Type",

//       render: (row) =>
//         row.type === "IN" ? (
//           <Chip
//             label="IN"
//             color="success"
//             size="small"
//             sx={{
//               fontWeight: 700,
//               minWidth: 65,
//               borderRadius: 2,
//             }}
//           />
//         ) : (
//           <Chip
//             label="OUT"
//             color="error"
//             size="small"
//             sx={{
//               fontWeight: 700,
//               minWidth: 65,
//               borderRadius: 2,
//             }}
//           />
//         ),
//     },

//     {
//       field: "quantity",
//       headerName: "Quantity",
//     },

//     {
//       field: "site_name",
//       headerName: "Site",

//       render: (row) => row.site_name || "-",
//     },

//     {
//       field: "purpose",
//       headerName: "Purpose",

//       render: (row) => row.purpose || "-",
//     },

//     {
//       field: "requested_by",
//       headerName: "Requested By",

//       render: (row) => row.requested_by || "-",
//     },

//     {
//       field: "date",
//       headerName: "Date",
//       render: (row) =>
//       row.date || "-",

     
//     },
//   ];

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper
//         elevation={0}
//         sx={{
//           borderRadius: 2,
//           overflow: "hidden",
//           border: "1px solid #dde3ec",
//           backgroundColor: "#fff",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             px: 3,
//             py: 2.5,
//             background:
//               "linear-gradient(135deg, #f8fafc 0%, #eef3f8 100%)",
//           }}
//         >
//           {/* Back Button */}
//           <Button
//             startIcon={<ArrowBackOutlined />}
//             onClick={() => navigate("/inventory")}
//             sx={{
//               mb: 2,
//               textTransform: "none",
//               fontWeight: 600,
//             }}
//           >
//           Back 
//           </Button>

//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 700,
//               color: "#1a3a5c",
//             }}
//           >
//             Stock History
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               mt: 0.5,
//               color: "#6b7280",
//             }}
//           >
//             Complete material stock movement tracking
//           </Typography>
//         </Box>
//         <Divider />

//         {/* Table */}
//         <Box sx={{ p: 2 }}>
//           <DataTable columns={columns} rows={history} />
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default StockHistory;

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Chip, Typography, Paper, Divider, Button } from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/common/DataTable";
import { getStockHistory } from "../../api/inventoryApi";

const StockHistory = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try { const data = await getStockHistory(materialId); setHistory(data.history); }
    catch (error) { console.log(error); toast.error("Failed To Fetch History"); }
    finally { setLoading(false); }
  };

  const columns = [
    { field: "type", headerName: "Type", render: (row) => row.type === "IN" ? <Chip label="IN" color="success" size="small" sx={{ fontWeight: 700, minWidth: 65, borderRadius: 2 }} /> : <Chip label="OUT" color="error" size="small" sx={{ fontWeight: 700, minWidth: 65, borderRadius: 2 }} /> },
    { field: "quantity", headerName: "Quantity" },
    { field: "site_name", headerName: "Site", render: (row) => row.site_name || "-" },
    { field: "purpose", headerName: "Purpose", render: (row) => row.purpose || "-" },
    { field: "requested_by", headerName: "Requested By", render: (row) => row.requested_by || "-" },
    { field: "date", headerName: "Date", render: (row) => row.date || "-" },
  ];

  if (loading) return <Loader />;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #dde3ec", backgroundColor: "#fff" }}>
        <Box sx={{ px: 3, py: 2.5, background: "linear-gradient(135deg, #f8fafc 0%, #eef3f8 100%)" }}>
          <Button startIcon={<ArrowBackOutlined />} onClick={() => navigate("/inventory")} sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}>Back</Button>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a3a5c" }}>Stock History</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#6b7280" }}>Complete material stock movement tracking</Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}><DataTable columns={columns} rows={history} /></Box>
      </Paper>
    </Box>
  );
};

export default StockHistory;