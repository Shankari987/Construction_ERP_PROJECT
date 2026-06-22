// import { Paper, Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import SupplierForm from "../../components/forms/SupplierForm";
// import { createSupplier } from "../../api/supplierApi";

// const AddSupplier = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (formData) => {
//     try {
//       await createSupplier(formData);
//       alert("Supplier Added Successfully");
//       navigate("/suppliers");
//     } catch (error) {
//       console.log(error);
//       alert(error.response?.data?.detail || "Error adding supplier");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center" }}>
//       <Box sx={{ width: "100%", maxWidth: 680 }}>
//         <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
//           <Box sx={{ mb:1, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
//             <Typography variant="h5" sx={{ mb: 0.5 }}>Add New Supplier</Typography>
       
//           </Box>
//           <SupplierForm onSubmit={handleSubmit} />
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default AddSupplier;
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SupplierForm from "../../components/forms/SupplierForm";
import { createSupplier } from "../../api/supplierApi";
import { toast } from "react-toastify";

const AddSupplier = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createSupplier(formData);
      toast.success("Supplier Added Successfully");
      navigate("/suppliers");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Error adding supplier");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 680 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ mb: 1, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>Add New Supplier</Typography>
          </Box>
          <SupplierForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AddSupplier;