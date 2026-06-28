// import { useEffect, useState } from "react";
// import { Button, Stack, Chip } from "@mui/material";
// import { deleteMaterial } from "../../api/materialApi";
// import { useNavigate } from "react-router-dom";
// import { getMaterials } from "../../api/materialApi";
// import Loader from "../../components/common/Loader";
// import DataTable from "../../components/common/DataTable";
// import PageHeader from "../../components/common/PageHeader";

// const Materials = () => {
//   const navigate = useNavigate();
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMaterials = async () => {
//     try {
//       const data = await getMaterials();
//       setMaterials(data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteMaterial(id);
//       alert("Material Deactivated");
//       fetchMaterials();
//     } catch (error) {
//       console.log(error);
//       alert(error.response.data.detail);
//     }
//   };

//   const columns = [
//     { field: "name", headerName: "Material Name" },
//     { field: "unit", headerName: "Unit" },
//     { field: "minimum_stock", headerName: "Min Stock" },
//     {
//       field: "actions",
//       headerName: "Actions",
//       render: (row) => (
//         <Stack direction="row" spacing={1}>
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={() => navigate(`/materials/edit/${row.id}`)}
//           >
//             Edit
//           </Button>
//           <Button
//             size="small"
//             color="error"
//             variant="contained"
//             onClick={() => handleDelete(row.id)}
//             sx={{ boxShadow: "none" }}
//           >
//             Deactivate
//           </Button>
//         </Stack>
//       ),
//     },
//   ];

//   if (loading) return <Loader />;

//   return (
//     <>
//       <PageHeader
//         title="Materials"
//         buttonText="Add Material"
//         onButtonClick={() => navigate("/materials/add")}
//       />
//       <DataTable columns={columns} rows={materials} />
//     </>
//   );
// };

// export default Materials;
import { useEffect, useState } from "react";

import { Button, Stack, Chip } from "@mui/material";

import {
  getMaterials,
  deleteMaterial,
  activateMaterial,
  deactivateMaterial,
} from "../../api/materialApi";

import { useNavigate } from "react-router-dom";

import Loader from "../../components/common/Loader";

import DataTable from "../../components/common/DataTable";

import PageHeader from "../../components/common/PageHeader";

import { toast } from "react-toastify";

const Materials = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials();

      setMaterials(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // HARD DELETE
  const handleDelete = async (id) => {
    try {
      await deleteMaterial(id);

      toast.success("Material deleted successfully");

      fetchMaterials();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.detail || "Failed to delete material");
    }
  };

  // DEACTIVATE
  const handleDeactivate = async (id) => {
    try {
      await deactivateMaterial(id);

      toast.success("Material deactivated");

      fetchMaterials();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail || "Failed to deactivate material",
      );
    }
  };

  // ACTIVATE
  const handleActivate = async (id) => {
    try {
      await activateMaterial(id);

      toast.success("Material activated");

      fetchMaterials();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail || "Failed to activate material",
      );
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Material Name",
    },

    {
      field: "unit",
      headerName: "Unit",
    },

    {
      field: "minimum_stock",
      headerName: "Min Stock",
    },

    // STATUS
    {
      field: "status",

      headerName: "Status",

      render: (row) => (
        <Chip
          label={row.is_active ? "Active" : "Inactive"}
          color={row.is_active ? "success" : "default"}
          size="small"
        />
      ),
    },

    // ACTIONS
    {
      field: "actions",

      headerName: "Actions",

      render: (row) => (
        <Stack direction="row" spacing={1}>
          {/* EDIT */}
          <Button
            size="small"
            variant="outlined"
            color="blue"
            onClick={() => navigate(`/materials/edit/${row.id}`)}
          >
            Edit
          </Button>

          {/* ACTIVE / INACTIVE */}
          {row.is_active ? (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleDeactivate(row.id)}
              sx={{
                boxShadow: "none",
              }}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="small"
              color="success"
              variant="contained"
              onClick={() => handleActivate(row.id)}
              sx={{
                boxShadow: "none",
              }}
            >
              Activate
            </Button>
          )}

       
        </Stack>
      ),
    },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <PageHeader
        title="Materials"
        buttonText="Add Material"
        onButtonClick={() => navigate("/materials/add")}
      />
      <DataTable columns={columns} rows={materials} />
    </>
  );
};
export default Materials;
