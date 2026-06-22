// import {
//   Paper,
//   Typography,
//   Box,
// } from "@mui/material";

// import { useNavigate } from "react-router-dom";

// import PurchaseForm from "../../components/forms/PurchaseForm";

// import { createPurchase } from "../../api/purchaseApi";

// const AddPurchase = () => {
//   const navigate = useNavigate();

//   const handleSubmit =
//     async (formData) => {
//       try {
//         await createPurchase(
//           formData
//         );

//         alert(
//           "Purchase Added Successfully"
//         );

//         navigate("/purchase");
//       } catch (error) {
//         console.log(error);

//         alert(
//           "Failed To Create Purchase"
//         );
//       }
//     };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Paper
//         elevation={2}
//         sx={{
//           p: 4,
//           width: "100%",
//           maxWidth: 800,
//         }}
//       >
//         <Typography
//           variant="h5"
//           mb={4}
//         >
//           Add Purchase
//         </Typography>

//         <PurchaseForm
//           onSubmit={handleSubmit}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default AddPurchase;
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PurchaseForm from "../../components/forms/PurchaseForm";
import { createPurchase } from "../../api/purchaseApi";
import { toast } from "react-toastify";

const AddPurchase = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createPurchase(formData);
      toast.success("Purchase Added Successfully");
      navigate("/purchase");
    } catch (error) {
      console.log(error);
      toast.error("Failed To Create Purchase");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={2} sx={{ p: 4, width: "100%", maxWidth: 800 }}>
        <Typography variant="h5" mb={4}>Add Purchase</Typography>
        <PurchaseForm onSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
};

export default AddPurchase;