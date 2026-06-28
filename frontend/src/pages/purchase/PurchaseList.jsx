import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  LocalShipping,
  Payment,
  Receipt,
  Print,
} from "@mui/icons-material";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import {
  getPurchases,
  updatePurchaseStatus,
  recordPurchasePayment,
} from "../../api/purchaseApi";
import { toast } from "react-toastify";

const PurchaseList = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Invoice Modal State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoicePurchase, setInvoicePurchase] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch without flashing blank — keeps existing data visible
  const refreshPurchases = async () => {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh purchases");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePurchaseStatus(id, newStatus);
      toast.success(`Purchase marked as ${newStatus}`);
      refreshPurchases();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const handleOpenPaymentModal = (purchase) => {
    setSelectedPurchase(purchase);
    const remaining = Math.max(0, purchase.total_amount - purchase.amount_paid);
    setPaymentAmount(remaining.toFixed(2));
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedPurchase(null);
    setPaymentAmount("");
  };

  const handleRecordPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.warning("Please enter a valid payment amount");
      return;
    }

    const remaining =
      Math.max(0, selectedPurchase.total_amount - selectedPurchase.amount_paid);
    if (amount > remaining + 0.01) {
      toast.error(
        `Payment cannot exceed outstanding balance of ₹${remaining.toLocaleString()}`
      );
      return;
    }

    try {
      await recordPurchasePayment(selectedPurchase.id, amount);
      toast.success("Payment recorded successfully");
      handleClosePaymentModal();
      refreshPurchases();
    } catch (error) {
      console.log(error);
      toast.error("Failed to record payment");
    }
  };

  // ---- Invoice Dialog ----
  const handleOpenInvoice = (purchase) => {
    setInvoicePurchase(purchase);
    setInvoiceModalOpen(true);
  };

  const handleCloseInvoice = () => {
    setInvoiceModalOpen(false);
    setInvoicePurchase(null);
  };

  const handlePrintInvoice = () => {
    const content = invoiceRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${invoicePurchase.invoice_number || "PO-" + invoicePurchase.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1c2533; padding: 40px; }
            .invoice-container { max-width: 720px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #1a3a5c; }
            .company { font-size: 22px; font-weight: 800; color: #1a3a5c; }
            .company-sub { font-size: 11px; color: #5d7083; margin-top: 4px; }
            .invoice-title { font-size: 28px; font-weight: 800; color: #1a3a5c; text-align: right; }
            .invoice-num { font-size: 12px; color: #5d7083; text-align: right; margin-top: 4px; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 28px; }
            .meta-block h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #a0aebb; margin-bottom: 6px; }
            .meta-block p { font-size: 14px; font-weight: 600; color: #1c2533; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            thead { background: #f5f7fa; }
            th { padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5d7083; text-align: left; border-bottom: 1px solid #dde3ec; }
            td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f0f3f8; }
            .amount-row td { font-weight: 700; }
            .totals { display: flex; justify-content: flex-end; }
            .totals-box { width: 280px; }
            .total-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #f0f3f8; }
            .total-line.grand { font-size: 16px; font-weight: 800; color: #1a3a5c; border-bottom: 2px solid #1a3a5c; border-top: 2px solid #1a3a5c; padding: 12px 0; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            .status-paid { background: #eaf8f0; color: #1e8449; }
            .status-unpaid { background: #fdf0ef; color: #c0392b; }
            .status-partial { background: #fef0e6; color: #ca6f1e; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f3f8; text-align: center; font-size: 11px; color: #a0aebb; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusChip = (status) => {
    let color = "default";
    let label = status;

    switch (status) {
      case "pending":
        color = "warning";
        label = "Pending Approval";
        break;
      case "approved":
        color = "info";
        label = "Approved";
        break;
      case "delivered":
        color = "success";
        label = "Delivered";
        break;
      case "cancelled":
        color = "error";
        label = "Cancelled";
        break;
    }

    return (
      <Chip label={label} color={color} size="small" sx={{ fontWeight: 600 }} />
    );
  };

  const getPaymentChip = (payment_status, status) => {
    if (status && status !== "delivered") {
      return (
        <Chip
          label="Not Yet Processed"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, color: "#8899aa", borderColor: "#dde3ec" }}
        />
      );
    }

    let color = "default";
    let label = payment_status;

    switch (payment_status) {
      case "unpaid":
        color = "error";
        label = "Unpaid";
        break;
      case "partially_paid":
        color = "warning";
        label = "Partially Paid";
        break;
      case "paid":
        color = "success";
        label = "Paid";
        break;
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    );
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
      field: "invoice_number",
      headerName: "Invoice #",
      render: (row) => row.invoice_number || `PO-${String(row.id).padStart(4, "0")}`,
    },
    {
      field: "quantity",
      headerName: "Quantity",
    },
    {
      field: "total_amount",
      headerName: "Total Cost",
      render: (row) => `₹${Number(row.total_amount).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      render: (row) => getStatusChip(row.status),
    },
    {
      field: "payment_status",
      headerName: "Payment",
      render: (row) => getPaymentChip(row.payment_status, row.status),
    },
    {
      field: "balance",
      headerName: "Unpaid Bal.",
      render: (row) => {
        if (row.status !== "delivered") return "—";
        const bal = Math.max(0, row.total_amount - row.amount_paid);
        return `₹${bal.toLocaleString()}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      render: (row) => {
        return (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {/* Workflow actions */}
            {row.status === "pending" && (
              <Tooltip title="Approve Order">
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  startIcon={<CheckCircle />}
                  onClick={() => handleStatusChange(row.id, "approved")}
                  sx={{
                    py: 0.25,
                    px: 1,
                    fontSize: "0.75rem",
                    borderRadius: 2,
                  }}
                >
                  Approve
                </Button>
              </Tooltip>
            )}

            {row.status === "approved" && (
              <Tooltip title="Mark Received & Add to Stock">
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  startIcon={<LocalShipping />}
                  onClick={() => handleStatusChange(row.id, "delivered")}
                  sx={{
                    py: 0.25,
                    px: 1,
                    fontSize: "0.75rem",
                    borderRadius: 2,
                  }}
                >
                  Deliver
                </Button>
              </Tooltip>
            )}

            {/* Invoice view button */}
            <Tooltip title="View Invoice">
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<Receipt />}
                onClick={() => handleOpenInvoice(row)}
                sx={{
                  py: 0.25,
                  px: 1,
                  fontSize: "0.75rem",
                  borderRadius: 2,
                }}
              >
                Invoice
              </Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader
        title="Purchase Management"
        buttonText="Create Purchase Order"
        onButtonClick={() => navigate("/purchase/add")}
      />

      <Box sx={{ mt: 2 }}>
        <DataTable columns={columns} rows={purchases} />
      </Box>

      {/* ─── Record Payment Dialog ─── */}
      <Dialog
        open={paymentModalOpen}
        onClose={handleClosePaymentModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Record Payment
        </DialogTitle>
        <DialogContent>
          {selectedPurchase && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Supplier:</strong> {selectedPurchase.supplier_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Material:</strong> {selectedPurchase.material_name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                <strong>Invoice #:</strong>{" "}
                {selectedPurchase.invoice_number || `PO-${String(selectedPurchase.id).padStart(4, "0")}`}
              </Typography>

              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "#f5f7fa",
                  border: "1px solid #eef1f6",
                }}
              >
                <GridBox
                  label="Total Amount"
                  value={`₹${Number(selectedPurchase.total_amount).toLocaleString()}`}
                />
                <GridBox
                  label="Amount Already Paid"
                  value={`₹${Number(selectedPurchase.amount_paid).toLocaleString()}`}
                />
                <GridBox
                  label="Remaining Balance"
                  value={`₹${Math.max(0, selectedPurchase.total_amount - selectedPurchase.amount_paid).toLocaleString()}`}
                  highlight
                />
              </Box>

              <TextField
                autoFocus
                fullWidth
                label="Payment Amount (₹)"
                type="number"
                variant="outlined"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                inputProps={{ min: 0.01, step: "any" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClosePaymentModal} sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleRecordPayment}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Submit Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Invoice View Dialog ─── */}
      <Dialog
        open={invoiceModalOpen}
        onClose={handleCloseInvoice}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Receipt sx={{ color: "#1a3a5c" }} />
            Purchase Invoice
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<Print />}
            onClick={handlePrintInvoice}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.78rem",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Print
          </Button>
        </DialogTitle>
        <DialogContent>
          {invoicePurchase && (
            <Box ref={invoiceRef}>
              <div className="invoice-container">
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                    pb: 2.5,
                    borderBottom: "2px solid #1a3a5c",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        color: "#1a3a5c",
                      }}
                    >
                      Construction ERP
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#5d7083",
                        mt: 0.5,
                      }}
                    >
                      Integrated Inventory & Finance Management
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#1a3a5c",
                      }}
                    >
                      INVOICE
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem", color: "#5d7083", mt: 0.3 }}
                    >
                      #{invoicePurchase.invoice_number || `PO-${String(invoicePurchase.id).padStart(4, "0")}`}
                    </Typography>
                  </Box>
                </Box>

                {/* Meta info */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "#a0aebb",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Supplier
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#1c2533",
                      }}
                    >
                      {invoicePurchase.supplier_name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "#a0aebb",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Order Status
                    </Typography>
                    {getStatusChip(invoicePurchase.status)}
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "#a0aebb",
                        mb: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      Payment Status
                    </Typography>
                    {getPaymentChip(invoicePurchase.payment_status, invoicePurchase.status)}
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Line Items Table */}
                <Box sx={{ overflowX: "auto", mb: 2 }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f7fa",
                          borderBottom: "1px solid #dde3ec",
                        }}
                      >
                        <th
                          style={{
                            padding: "12px 16px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#5d7083",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "12px 16px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#5d7083",
                            textAlign: "center",
                          }}
                        >
                          Quantity
                        </th>
                        <th
                          style={{
                            padding: "12px 16px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#5d7083",
                            textAlign: "right",
                          }}
                        >
                          Unit Price
                        </th>
                        <th
                          style={{
                            padding: "12px 16px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            color: "#5d7083",
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        style={{ borderBottom: "1px solid #f0f3f8" }}
                      >
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#1c2533",
                          }}
                        >
                          {invoicePurchase.material_name}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "0.85rem",
                            color: "#1c2533",
                            textAlign: "center",
                          }}
                        >
                          {invoicePurchase.quantity}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "0.85rem",
                            color: "#1c2533",
                            textAlign: "right",
                          }}
                        >
                          ₹{Number(invoicePurchase.unit_price).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#1c2533",
                            textAlign: "right",
                          }}
                        >
                          ₹
                          {Number(
                            invoicePurchase.total_amount
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>

                {/* Totals */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{ width: 280 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1,
                        borderBottom: "1px solid #f0f3f8",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.82rem", color: "#5d7083" }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "#1c2533",
                        }}
                      >
                        ₹
                        {Number(
                          invoicePurchase.total_amount
                        ).toLocaleString()}
                      </Typography>
                    </Box>
                    {invoicePurchase.status === "delivered" ? (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1,
                            borderBottom: "1px solid #f0f3f8",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              color: "#1e8449",
                              fontWeight: 600,
                            }}
                          >
                            Amount Paid
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              color: "#1e8449",
                            }}
                          >
                            − ₹
                            {Number(
                              invoicePurchase.amount_paid
                            ).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1.5,
                            borderTop: "2px solid #1a3a5c",
                            borderBottom: "2px solid #1a3a5c",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 800,
                              color: "#1a3a5c",
                            }}
                          >
                            Balance Due
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 800,
                              color:
                                invoicePurchase.total_amount -
                                  invoicePurchase.amount_paid <=
                                0
                                  ? "#1e8449"
                                  : "#c0392b",
                            }}
                          >
                            ₹
                            {Math.max(0, invoicePurchase.total_amount - invoicePurchase.amount_paid).toLocaleString()}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ py: 1.5, borderTop: "1px solid #f0f3f8", mt: 0.5 }}>
                        <Typography sx={{ fontSize: "0.82rem", fontStyle: "italic", color: "#8899aa", textAlign: "right" }}>
                          Payment Activity: Not Yet Processed (Awaiting Delivery)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    mt: 5,
                    pt: 2,
                    borderTop: "1px solid #f0f3f8",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.7rem", color: "#a0aebb" }}
                  >
                    This is a system-generated invoice from Construction ERP.
                    No signature required.
                  </Typography>
                </Box>
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseInvoice} sx={{ fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Simple visual row helper for modal
const GridBox = ({ label, value, highlight }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 1,
      "&:last-child": { mb: 0 },
    }}
  >
    <Typography
      variant="body2"
      color={highlight ? "primary" : "textSecondary"}
      sx={{ fontWeight: highlight ? 700 : 500 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      color={highlight ? "primary" : "textPrimary"}
      sx={{ fontWeight: 700 }}
    >
      {value}
    </Typography>
  </Box>
);

export default PurchaseList;
