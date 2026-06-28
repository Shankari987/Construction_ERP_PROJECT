// import { useEffect, useState } from "react";
// import { Button, Stack } from "@mui/material";
// import { deleteSupplier, getSuppliers } from "../../api/supplierApi";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../components/common/Loader";
// import DataTable from "../../components/common/DataTable";
// import PageHeader from "../../components/common/PageHeader";

// const Suppliers = () => {
//   const navigate = useNavigate();
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSuppliers = async () => {
//     try {
//       const data = await getSuppliers();
//       setSuppliers(data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteSupplier(id);
//       alert("Supplier Deleted");
//       fetchSuppliers();
//     } catch (error) {
//       console.log(error);
//       alert(error.response?.data?.detail || "Error deleting supplier");
//     }
//   };

//   const columns = [
//     { field: "name", headerName: "Supplier Name" },
//     { field: "contact", headerName: "Contact" },
//     { field: "address", headerName: "Address" },
//     {
//       field: "actions",
//       headerName: "Actions",
//       render: (row) => (
//         <Stack direction="row" spacing={1}>
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={() => navigate(`/suppliers/edit/${row.id}`)}
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
//         title="Suppliers"
//         buttonText="Add Supplier"
//         onButtonClick={() => navigate("/suppliers/add")}
//       />
//       <DataTable columns={columns} rows={suppliers} />
//     </>
//   );
// };

// export default Suppliers;
import { useEffect, useState } from "react";

import {
  Button,
  Stack,
  Chip,
} from "@mui/material";

import {
  getSuppliers,
  deleteSupplier,
  activateSupplier,
  deactivateSupplier,
} from "../../api/supplierApi";

import { useNavigate } from "react-router-dom";

import Loader from "../../components/common/Loader";

import DataTable from "../../components/common/DataTable";

import PageHeader from "../../components/common/PageHeader";

import { toast } from "react-toastify";

const Suppliers = () => {

  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);


  const fetchSuppliers = async () => {

    try {

      const data =
        await getSuppliers();

      setSuppliers(data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load suppliers"
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    fetchSuppliers();

  }, []);


  // HARD DELETE
  const handleDelete = async (id) => {

    try {

      await deleteSupplier(id);

      toast.success(
        "Supplier deleted successfully"
      );

      fetchSuppliers();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete supplier"
      );
    }
  };


  // DEACTIVATE
  const handleDeactivate = async (id) => {

    try {

      await deactivateSupplier(id);

      toast.success(
        "Supplier deactivated"
      );

      fetchSuppliers();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Failed to deactivate supplier"
      );
    }
  };


  // ACTIVATE
  const handleActivate = async (id) => {

    try {

      await activateSupplier(id);

      toast.success(
        "Supplier activated"
      );

      fetchSuppliers();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.detail ||
        "Failed to activate supplier"
      );
    }
  };


  const columns = [

    {
      field: "name",
      headerName: "Supplier Name",
    },

    {
      field: "contact",
      headerName: "Contact",
    },

    {
      field: "address",
      headerName: "Address",
    },


    // STATUS
    {
      field: "status",

      headerName: "Status",

      render: (row) => (

        <Chip
          label={
            row.is_active
              ? "Active"
              : "Inactive"
          }

          color={
            row.is_active
              ? "success"
              : "default"
          }

          size="small"
        />
      ),
    },


    // ACTIONS
    {
      field: "actions",

      headerName: "Actions",

      render: (row) => (

        <Stack
          direction="row"
          spacing={1}
        >

          {/* EDIT */}
          <Button
            size="small"

            variant="outlined"

            onClick={() =>
              navigate(
                `/suppliers/edit/${row.id}`
              )
            }
          >
            Edit
          </Button>


          {/* ACTIVE / INACTIVE */}
          {row.is_active ? (

            <Button
              size="small"

              color="primary"

              variant="contained"

              onClick={() =>
                handleDeactivate(
                  row.id
                )
              }

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

              onClick={() =>
                handleActivate(
                  row.id
                )
              }

              sx={{
                boxShadow: "none",
              }}
            >
              Activate
            </Button>

          )}


          {/* DELETE */}
          {/* <Button
            size="small"

            color="error"

            variant="contained"

            onClick={() =>
              handleDelete(row.id)
            }
          >
            Delete
          </Button> */}

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
        title="Suppliers"

        buttonText="Add Supplier"

        onButtonClick={() =>
          navigate("/suppliers/add")
        }
      />

      <DataTable
        columns={columns}
        rows={suppliers}
      />
    </>
  );
};

export default Suppliers;