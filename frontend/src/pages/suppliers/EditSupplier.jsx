// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   Paper,
//   Typography,
//   Box,
// } from "@mui/material";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import SupplierForm from "../../components/forms/SupplierForm";

// import {
//   updateSupplier,
//   getSupplierById,
// } from "../../api/supplierApi";

// const EditSupplier = () => {

//   const navigate =
//     useNavigate();

//   const { id } =
//     useParams();

//   const [supplier,
//     setSupplier] =
//     useState(null);

//   useEffect(() => {
//     fetchSupplier();
//   }, []);

//   const fetchSupplier =
//     async () => {

//       try {

//         const data =
//           await getSupplierById(id);

//         setSupplier(data);

//       } catch (error) {
//         console.log(error);
//       }
//     };

//   const handleSubmit =
//     async (formData) => {

//       try {

//         await updateSupplier(
//           id,
//           formData
//         );

//         alert(
//           "Supplier Updated"
//         );

//         navigate(
//           "/suppliers"
//         );

//       } catch (error) {

//         console.log(error);

//         alert(
//           error.response.data.detail
//         );
//       }
//     };

//   if (!supplier) {

//     return (
//       <Typography>
//         Loading...
//       </Typography>
//     );
//   }

//   return (
//     <Box
//       sx={{
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
//           borderRadius: 3,
//         }}
//       >
//         <Typography
//           variant="h5"
//           mb={3}
//           fontWeight="bold"
//         >
//           Edit Supplier
//         </Typography>

//         <SupplierForm
//           initialData={supplier}
//           onSubmit={handleSubmit}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default EditSupplier;

import { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SupplierForm from "../../components/forms/SupplierForm";
import { updateSupplier, getSupplierById } from "../../api/supplierApi";
import { toast } from "react-toastify";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => { fetchSupplier(); }, []);

  const fetchSupplier = async () => {
    try { const data = await getSupplierById(id); setSupplier(data); }
    catch (error) { console.log(error); }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateSupplier(id, formData);
      toast.success("Supplier Updated");
      navigate("/suppliers");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Failed to update supplier");
    }
  };

  if (!supplier) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 700, borderRadius: 3 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">Edit Supplier</Typography>
        <SupplierForm initialData={supplier} onSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
};

export default EditSupplier;