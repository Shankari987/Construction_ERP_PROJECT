import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Chip } from "@mui/material";

import DataTable from "../../components/common/DataTable";

import PageHeader from "../../components/common/PageHeader";

import Loader from "../../components/common/Loader";

import { getPurchases } from "../../api/purchaseApi";

const PurchaseList = () => {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getPurchases();

      setPurchases(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";

      case "pending":
        return "warning";

      case "delivered":
        return "primary";

      default:
        return "default";
    }
  };

  const columns = [


    {
      field: "material_name",
      headerName: "Material",
    },

    {
      field: "supplier_name",
      headerName: "Supplier",
    },

    {
      field: "quantity",
      headerName: "Quantity",
    },

    {
      field: "unit_price",
      headerName: "Unit Price",
    },

    {
      field: "total_amount",
      headerName: "Total Amount",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        title="Purchase List"
        buttonText="Add Purchase"
        onButtonClick={() => navigate("/purchase/add")}
      />

      <DataTable columns={columns} rows={purchases} />
    </>
  );
};

export default PurchaseList;
