// import { Box, Button, TextField } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const SupplierForm = ({ onSubmit, initialData }) => {
//   const [formData, setFormData] = useState({ name: "", contact: "", address: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || "",
//         contact: initialData.contact || "",
//         address: initialData.address || "",
//       });
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.contact) {
//       alert("Name and contact are required");
//       return;
//     }
//     onSubmit(formData);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <TextField
//         fullWidth
//         label="Supplier Name"
//         name="name"
//         margin="normal"
//         value={formData.name}
//         onChange={handleChange}
//         placeholder="e.g. ABC Building Materials"
//       />

//       <TextField
//         fullWidth
//         label="Contact Number"
//         name="contact"
//         margin="normal"
//         value={formData.contact}
//         onChange={handleChange}
//         placeholder="e.g. +91 98765 43210"
//       />

//       <TextField
//         fullWidth
//         label="Address"
//         name="address"
//         margin="normal"
//         value={formData.address}
//         onChange={handleChange}
//         placeholder="Full address"
//         multiline
//         rows={3}
//       />

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
//           Save Supplier
//         </Button>
//         <Button fullWidth variant="outlined" sx={{ py: 1.4 }} onClick={() => navigate("/suppliers")}>
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default SupplierForm;
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupplierForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ name: "", contact: "", address: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name || "", contact: initialData.contact || "", address: initialData.address || "" });
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      toast.warning("Name and contact are required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField fullWidth label="Supplier Name" name="name" margin="normal" value={formData.name} onChange={handleChange} placeholder="e.g. ABC Building Materials" />
      <TextField fullWidth label="Contact Number" name="contact" margin="normal" value={formData.contact} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
      <TextField fullWidth label="Address" name="address" margin="normal" value={formData.address} onChange={handleChange} placeholder="Full address" multiline rows={3} />
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button fullWidth type="submit" variant="contained" sx={{ py: 1.4, background: "linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)", boxShadow: "0 4px 12px rgba(26,58,92,0.25)" }}>Save Supplier</Button>
        <Button fullWidth variant="outlined" sx={{ py: 1.4 }} onClick={() => navigate("/suppliers")}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default SupplierForm;