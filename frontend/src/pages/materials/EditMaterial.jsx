// import { useEffect, useState } from "react";
// import { Paper, Typography, Box } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import MaterialForm from "../../components/forms/MaterialForm";
// import { updateMaterial, getMaterialById } from "../../api/materialApi";
// import Loader from "../../components/common/Loader";

// const EditMaterial = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [material, setMaterial] = useState(null);

//   useEffect(() => {
//     fetchMaterial();
//   }, []);

//   const fetchMaterial = async () => {
//     try {
//       const data = await getMaterialById(id);
//       setMaterial(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleSubmit = async (formData) => {
//     try {
//       await updateMaterial(id, formData);
//       alert("Material Updated");
//       navigate("/materials");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (!material) return <Loader />;

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center" }}>
//       <Box sx={{ width: "100%", maxWidth: 680 }}>
//         <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
//           <Box sx={{ mb: 3.5, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
//             <Typography variant="h5" sx={{ mb: 0.5 }}>
//               Edit Material
//             </Typography>
//             <Typography sx={{ fontSize: "0.82rem", color: "#a0aebb" }}>
//               Update the material details below
//             </Typography>
//           </Box>

//           <MaterialForm initialData={material} onSubmit={handleSubmit} />
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default EditMaterial;
import { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MaterialForm from "../../components/forms/MaterialForm";
import { updateMaterial, getMaterialById } from "../../api/materialApi";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const EditMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [material, setMaterial] = useState(null);

  useEffect(() => { fetchMaterial(); }, []);

  const fetchMaterial = async () => {
    try { const data = await getMaterialById(id); setMaterial(data); }
    catch (error) { console.log(error); }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateMaterial(id, formData);
      toast.success("Material Updated");
      navigate("/materials");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Failed to update material");
    }
  };

  if (!material) return <Loader />;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 680 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ mb: 3.5, pb: 3, borderBottom: "1px solid #f0f3f8" }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>Edit Material</Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#a0aebb" }}>Update the material details below</Typography>
          </Box>
          <MaterialForm initialData={material} onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Box>
  );
};

export default EditMaterial;
