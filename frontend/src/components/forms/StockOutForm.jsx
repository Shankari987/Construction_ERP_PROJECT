// import { Box, Button, MenuItem, TextField } from "@mui/material";

// import { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { getMaterials } from "../../api/materialApi";

// const StockOutForm = ({ onSubmit }) => {
//   const navigate = useNavigate();

//   const [materials, setMaterials] = useState([]);

//   const [formData, setFormData] = useState({
//     material_id: "",
//     quantity: "",
//     site_name: "",
//     purpose: "",
//     requested_by: "",
//   });

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const fetchMaterials = async () => {
//     try {
//       const data = await getMaterials();

//       setMaterials(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.material_id || !formData.quantity || !formData.site_name) {
//       alert("Required fields missing");

//       return;
//     }

//     onSubmit(formData);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <TextField
//         select
//         fullWidth
//         label="Material"
//         name="material_id"
//         margin="normal"
//         value={formData.material_id}
//         onChange={handleChange}
//       >
//         {materials.map((material) => (
//           <MenuItem key={material.id} value={material.id}>
//             {material.name}
//           </MenuItem>
//         ))}
//       </TextField>

//       <TextField
//         fullWidth
//         label="Quantity"
//         name="quantity"
//         type="number"
//         margin="normal"
//         value={formData.quantity}
//         onChange={handleChange}
//       />

//       <TextField
//         fullWidth
//         label="Site Name"
//         name="site_name"
//         margin="normal"
//         value={formData.site_name}
//         onChange={handleChange}
//       />

//       <TextField
//         fullWidth
//         label="Purpose"
//         name="purpose"
//         margin="normal"
//         value={formData.purpose}
//         onChange={handleChange}
//       />

//       <TextField
//         fullWidth
//         label="Requested By"
//         name="requested_by"
//         margin="normal"
//         value={formData.requested_by}
//         onChange={handleChange}
//       />

//       <Box
//         sx={{
//           display: "flex",
//           gap: 2,
//           mt: 3,
//         }}
//       >
//         <Button fullWidth type="submit" variant="contained">
//           Issue Material
//         </Button>

//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={() => navigate("/inventory")}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default StockOutForm;
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMaterials } from "../../api/materialApi";
import { toast } from "react-toastify";

const StockOutForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    material_id: "",
    quantity: "",
    site_name: "",
    purpose: "",
    requested_by: "",
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data.filter((material) => material.is_active));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.material_id || !formData.quantity || !formData.site_name) {
      toast.warning("Required fields missing");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        select
        fullWidth
        label="Material"
        name="material_id"
        margin="normal"
        value={formData.material_id}
        onChange={handleChange}
      >
        {materials.map((m) => (
          <MenuItem key={m.id} value={m.id}>
            {m.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Quantity"
        name="quantity"
        type="number"
        margin="normal"
        value={formData.quantity}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Site Name"
        name="site_name"
        margin="normal"
        value={formData.site_name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Purpose"
        name="purpose"
        margin="normal"
        value={formData.purpose}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Requested By"
        name="requested_by"
        margin="normal"
        value={formData.requested_by}
        onChange={handleChange}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button fullWidth type="submit" variant="contained">
          Issue Material
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/inventory")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default StockOutForm;
