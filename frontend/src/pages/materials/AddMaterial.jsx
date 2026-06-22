// import { Paper, Typography, Box, Breadcrumbs, Link as MuiLink } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import MaterialForm from "../../components/forms/MaterialForm";
// import { createMaterial } from "../../api/materialApi";

// const AddMaterial = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (formData) => {
//     try {
//       await createMaterial(formData);
//       alert("Material Added Successfully");
//       navigate("/materials");
//     } catch (error) {
//       console.log(error);
//       alert(error.response.data.detail);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center" }}>
//       <Box sx={{ width: "100%", maxWidth: 680 }}>
//         <Paper
//           elevation={0}
//           sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}
//         >
//           <Box sx={{ mb: 1, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
//             <Typography variant="h5" sx={{ mb: 0.5 }}>
//               Add New Material
//             </Typography>
//           </Box>

//           <MaterialForm onSubmit={handleSubmit} />
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default AddMaterial;
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MaterialForm from "../../components/forms/MaterialForm";
import { createMaterial } from "../../api/materialApi";
import { toast } from "react-toastify";

const AddMaterial = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createMaterial(formData);
      toast.success("Material Added Successfully");
      navigate("/materials");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Failed to add material");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 680 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ mb: 1, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>Add New Material</Typography>
          </Box>
          <MaterialForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AddMaterial;