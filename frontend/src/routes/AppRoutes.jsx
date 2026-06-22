import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AccessDenied from "../components/common/AccessDenied";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";

import Materials from "../pages/materials/Materials";

import AddMaterial from "../pages/materials/AddMaterial";
import EditMaterial from "../pages/materials/EditMaterial";
import Suppliers from "../pages/suppliers/Suppliers";

import AddSupplier from "../pages/suppliers/AddSupplier";
import EditSupplier from "../pages/suppliers/EditSupplier";
import PurchaseList from "../pages/purchase/PurchaseList";

import AddPurchase from "../pages/purchase/AddPurchase";

import Inventory from "../pages/inventory/Inventory";
import StockOut from "../pages/inventory/StockOut";
import StockHistory from "../pages/inventory/StockHistory";
import Finance from "../pages/finance/Finance";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}

            <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "site_engineer"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/access-denied" element={<AccessDenied />} />
      {/* Materials */}
      <Route
        path="/materials"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "site_engineer"]}>
            <Layout>
              <Materials />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Add Material */}
      <Route
        path="/materials/add"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AddMaterial />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/materials/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <EditMaterial />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Suppliers */}
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Suppliers />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Add Supplier */}
      <Route
        path="/suppliers/add"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <AddSupplier />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <EditSupplier />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Purchase */}
      <Route
        path="/purchase"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <Layout>
              <PurchaseList />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Add Purchase */}
      <Route
        path="/purchase/add"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <Layout>
              <AddPurchase />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "site_engineer"]}>
            <Layout>
              <Inventory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/stock-out"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "site_engineer"]}>
            <Layout>
              <StockOut />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory/history/:materialId"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "site_engineer"]}>
            <Layout>
              <StockHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Finance */}
      <Route
        path="/finance"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <Layout>
              <Finance />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Invalid Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
