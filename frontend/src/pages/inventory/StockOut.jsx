// import { Box, Paper, Typography } from "@mui/material";

// import { useNavigate } from "react-router-dom";

// import StockOutForm from "../../components/forms/StockOutForm";

// import { stockOutMaterial } from "../../api/inventoryApi";

// const StockOut = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (formData) => {
//     try {
//       await stockOutMaterial(formData);
//       alert("Material Issued Successfully");
//       navigate("/inventory");
//     } catch (error) {
//       console.log(error);

//       if (error.response?.data?.detail) {
//         alert(error.response.data.detail);
//       } else {
//         alert("Stock Out Failed");
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         mt:1,
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           p: 4,
//           width: "100%",
//           maxWidth: 700,
//         }}
//       >
//         <Typography variant="h5" mb={3}>
//           Stock Out
//         </Typography>

//         <StockOutForm onSubmit={handleSubmit} />
//       </Paper>
//     </Box>
//   );
// };

// export default StockOut;
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StockOutForm from "../../components/forms/StockOutForm";
import { stockOutMaterial } from "../../api/inventoryApi";
import { toast } from "react-toastify";

const StockOut = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await stockOutMaterial(formData);
      toast.success("Material Issued Successfully");
      navigate("/inventory");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Stock Out Failed");
    }
  };

  return (
    <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
        <Typography variant="h5" mb={3}>Stock Out</Typography>
        <StockOutForm onSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
};

export default StockOut;