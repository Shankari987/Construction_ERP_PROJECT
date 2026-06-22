// import { Box, Button, TextField, MenuItem, Typography, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getMaterials } from "../../api/materialApi";
// import { getSuppliers } from "../../api/supplierApi";

// const PurchaseForm = ({ onSubmit }) => {
//   const [materials, setMaterials] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [formData, setFormData] = useState({
//     material_id: "",
//     supplier_id: "",
//     quantity: "",
//     unit_price: "",
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const materialsData = await getMaterials();
//       const suppliersData = await getSuppliers();
//       setMaterials(materialsData);
//       setSuppliers(suppliersData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const totalAmount = Number(formData.quantity || 0) * Number(formData.unit_price || 0);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.material_id || !formData.supplier_id || !formData.quantity || !formData.unit_price) {
//       alert("All fields are required");
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
//         select
//         fullWidth
//         label="Supplier"
//         name="supplier_id"
//         margin="normal"
//         value={formData.supplier_id}
//         onChange={handleChange}
//       >
//         {suppliers.map((supplier) => (
//           <MenuItem key={supplier.id} value={supplier.id}>
//             {supplier.name}
//           </MenuItem>
//         ))}
//       </TextField>

//       <Box sx={{ display: "flex", gap: 2 }}>
//         <TextField
//           fullWidth
//           label="Quantity"
//           name="quantity"
//           type="number"
//           margin="normal"
//           value={formData.quantity}
//           onChange={handleChange}
//           inputProps={{ min: 1 }}
//         />
//         <TextField
//           fullWidth
//           label="Unit Price (₹)"
//           name="unit_price"
//           type="number"
//           margin="normal"
//           value={formData.unit_price}
//           onChange={handleChange}
//           inputProps={{ min: 0 }}
//         />
//       </Box>

//       {/* Total Amount Preview */}
//       <Box
//         sx={{
//           mt: 3,
//           p: 2.5,
//           borderRadius: 2.5,
//           background: "linear-gradient(135deg, #eaf0f8 0%, #f0f7ff 100%)",
//           border: "1px solid #c8daf0",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#5d7083" }}>
//           Calculated Total Amount
//         </Typography>
//         <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a5c" }}>
//           ₹{totalAmount.toLocaleString()}
//         </Typography>
//       </Box>

//       <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           sx={{
//             py: 1.4,
//             background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
//             boxShadow: "0 4px 12px rgba(26,58,92,0.25)",
//           }}
//         >
//           Create Purchase
//         </Button>
//         <Button
//           fullWidth
//           variant="outlined"
//           sx={{ py: 1.4 }}
//           onClick={() => navigate("/purchase")}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default PurchaseForm;
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMaterials } from "../../api/materialApi";
import { getSuppliers } from "../../api/supplierApi";
import { toast } from "react-toastify";

const PurchaseForm = ({ onSubmit }) => {
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    material_id: "",
    supplier_id: "",
    quantity: "",
    unit_price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const materialsData = await getMaterials();
      const suppliersData = await getSuppliers();

      // SHOW ONLY ACTIVE MATERIALS
      setMaterials(materialsData.filter((material) => material.is_active));

      // SHOW ONLY ACTIVE SUPPLIERS
      setSuppliers(suppliersData.filter((supplier) => supplier.is_active));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const totalAmount =
    Number(formData.quantity || 0) * Number(formData.unit_price || 0);
  const selectedMaterial = materials.find(
    (material) => material.id == formData.material_id,
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.material_id ||
      !formData.supplier_id ||
      !formData.quantity ||
      !formData.unit_price
    ) {
      toast.warning("All fields are required");
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
        select
        fullWidth
        label="Supplier"
        name="supplier_id"
        margin="normal"
        value={formData.supplier_id}
        onChange={handleChange}
      >
        {suppliers.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label={`Quantity ${
            selectedMaterial ? `(${selectedMaterial.unit})` : ""
          }`}
          name="quantity"
          type="number"
          margin="normal"
          value={formData.quantity}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />{" "}
        <TextField
          fullWidth
          label="Unit Price (₹)"
          name="unit_price"
          type="number"
          margin="normal"
          value={formData.unit_price}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 2.5,
          background: "linear-gradient(135deg, #eaf0f8 0%, #f0f7ff 100%)",
          border: "1px solid #c8daf0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#5d7083" }}
        >
          Calculated Total Amount
        </Typography>
        <Typography
          sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a3a5c" }}
        >
          ₹{totalAmount.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.4,
            background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)",
            boxShadow: "0 4px 12px rgba(26,58,92,0.25)",
          }}
        >
          Create Purchase
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{ py: 1.4 }}
          onClick={() => navigate("/purchase")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PurchaseForm;
