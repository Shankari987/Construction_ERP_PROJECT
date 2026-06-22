// import { useEffect, useState } from "react";

// import { Chip, Button } from "@mui/material";

// import Loader from "../../components/common/Loader";
// import { useNavigate } from "react-router-dom";
// import DataTable from "../../components/common/DataTable";

// import PageHeader from "../../components/common/PageHeader";

// import { getInventory } from "../../api/inventoryApi";

// const Inventory = () => {
//   const [inventory, setInventory] = useState([]);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   const fetchInventory = async () => {
//     try {
//       const data = await getInventory();

//       setInventory(data);
//     } catch (error) {
//       console.log(error);

//       alert("Failed To Fetch Inventory");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const navigate = useNavigate();
//   const columns = [
//     {
//       field: "material_name",
//       headerName: "Material",
//     },

//     {
//       field: "unit",
//       headerName: "Unit",
//     },

//     {
//       field: "available_stock",
//       headerName: "Available Stock",
//     },

//     {
//       field: "minimum_stock",
//       headerName: "Minimum Stock",
//     },

//     {
//       field: "low_stock",
//       headerName: "Status",

//       render: (row) =>
//         row.low_stock ? (
//           <Chip label="Low Stock" color="error" size="small" />
//         ) : (
//           <Chip label="Available" color="success" size="small" />
//         ),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",

//       render: (row) => (
//         <Button
//           variant="outlined"
//           size="small"
//           onClick={() => navigate(`/inventory/history/${row.material_id}`)}
//         >
//           History
//         </Button>
//       ),
//     },
//   ];

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <PageHeader
//         title="Inventory"
//         buttonText="Stock Out"
//         onButtonClick={() => navigate("/inventory/stock-out")}
//       />

//       <DataTable columns={columns} rows={inventory} />
//     </>
//   );
// };

// export default Inventory;
import { useEffect, useState } from "react";
import { Chip, Button } from "@mui/material";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { getInventory } from "../../api/inventoryApi";
import { toast } from "react-toastify";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try { const data = await getInventory(); setInventory(data); }
    catch (error) { console.log(error); toast.error("Failed To Fetch Inventory"); }
    finally { setLoading(false); }
  };

  const columns = [
    { field: "material_name", headerName: "Material" },
    { field: "unit", headerName: "Unit" },
    { field: "available_stock", headerName: "Available Stock" },
    { field: "minimum_stock", headerName: "Minimum Stock" },
    { field: "low_stock", headerName: "Status", render: (row) => row.low_stock ? <Chip label="Low Stock" color="error" size="small" /> : <Chip label="Available" color="success" size="small" /> },
    { field: "actions", headerName: "Actions", render: (row) => <Button variant="outlined" size="small" onClick={() => navigate(`/inventory/history/${row.material_id}`)}>History</Button> },
  ];

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Inventory" buttonText="Stock Out" onButtonClick={() => navigate("/inventory/stock-out")} />
      <DataTable columns={columns} rows={inventory} />
    </>
  );
};

export default Inventory;