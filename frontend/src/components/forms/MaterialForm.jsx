// import { Box, Button, TextField, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const MaterialForm = ({ onSubmit, initialData }) => {
//   const [formData, setFormData] = useState({ name: "", unit: "", minimum_stock: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || "",
//         unit: initialData.unit || "",
//         minimum_stock: initialData.minimum_stock || "",
//       });
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.unit || !formData.minimum_stock) {
//       alert("All fields are required");
//       return;
//     }
//     onSubmit(formData);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
//         <TextField
//           fullWidth
//           label="Material Name"
//           name="name"
//           margin="normal"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="e.g. Portland Cement"
//         />

//         <TextField
//           fullWidth
//           label="Unit of Measurement"
//           name="unit"
//           margin="normal"
//           value={formData.unit}
//           onChange={handleChange}
//           placeholder="e.g. kg, litre, bag"
//         />

//         <TextField
//           fullWidth
//           label="Minimum Stock Level"
//           name="minimum_stock"
//           type="number"
//           margin="normal"
//           value={formData.minimum_stock}
//           onChange={handleChange}
//           placeholder="e.g. 100"
//           inputProps={{ min: 0 }}
//         />
//       </Box>

//       <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
//         <Button
//           fullWidth
//           type="submit"
//           variant="contained"
//           sx={{
//             py: 1.4,
//             background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
//             boxShadow: "0 4px 12px rgba(26,58,92,0.25)",
//           }}
//         >
//           Save Material
//         </Button>

//         <Button
//           fullWidth
//           variant="outlined"
//           sx={{ py: 1.4 }}
//           onClick={() => navigate("/materials")}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default MaterialForm;
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MaterialForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ name: "", unit: "", minimum_stock: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        unit: initialData.unit || "",
        minimum_stock: initialData.minimum_stock || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.unit || !formData.minimum_stock) {
      toast.warning("All fields are required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <TextField fullWidth label="Material Name" name="name" margin="normal" value={formData.name} onChange={handleChange} placeholder="e.g. Portland Cement" />
        <TextField fullWidth label="Unit of Measurement" name="unit" margin="normal" value={formData.unit} onChange={handleChange} placeholder="e.g. kg, litre, bag" />
        <TextField fullWidth label="Minimum Stock Level" name="minimum_stock" type="number" margin="normal" value={formData.minimum_stock} onChange={handleChange} placeholder="e.g. 100" inputProps={{ min: 0 }} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button fullWidth type="submit" variant="contained" sx={{ py: 1.4, background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)", boxShadow: "0 4px 12px rgba(26,58,92,0.25)" }}>Save Material</Button>
        <Button fullWidth variant="outlined" sx={{ py: 1.4 }} onClick={() => navigate("/materials")}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default MaterialForm;