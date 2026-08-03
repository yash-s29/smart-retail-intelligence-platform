import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// ─── Layouts & Hooks ─────────────────────────────────────
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks/useAuth";

// ─── Auth Pages ──────────────────────────────────────────
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// ─── Main Pages ──────────────────────────────────────────
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import Search from "../pages/search/Search";

// ─── Public Pages ────────────────────────────────────────
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import FAQ from "../pages/FAQ/FAQ";
import HelpCenter from "../pages/Help/HelpCenter";
import Documentation from "../pages/Documentation/Documentation";
import Blog from "../pages/Blog/Blog";
import PrivacyPolicy from "../pages/Privacy/PrivacyPolicy";
import TermsOfService from "../pages/Terms/TermsOfService";
import CookiePolicy from "../pages/Cookies/CookiePolicy";
import APIStatus from "../pages/APIStatus/APIStatus";

// ─── Products ────────────────────────────────────────────
import ProductList from "../pages/products/ProductList";
import AddProduct from "../pages/products/AddProduct";
import EditProduct from "../pages/products/EditProduct";
import ProductDetails from "../pages/products/ProductDetails";

// ─── Inventory ───────────────────────────────────────────
import Inventory from "../pages/inventory/Inventory";
import InventoryAlerts from "../pages/inventory/InventoryAlerts";
import RestockRecommendations from "../pages/inventory/RestockRecommendations";
import AddInventory from "../pages/inventory/AddInventory";
import InventoryDetails from "../pages/inventory/InventoryDetails";
import EditInventory from "../pages/inventory/EditInventory";

// ─── Sales ───────────────────────────────────────────────
import SalesDashboard from "../pages/sales/SalesDashboard";
import AddSale from "../pages/sales/AddSale";
import SalesList from "../pages/sales/SalesList";
import EditSale from "../pages/sales/EditSale";
import SaleDetails from "../pages/sales/SaleDetails";
import UploadSales from "../pages/sales/UploadSales";
import SalesAnalytics from "../pages/sales/SalesAnalytics";

// ─── Forecast & Reports ──────────────────────────────────
import Forecasting from "../pages/forecast/Forecasting";
import Reports from "../pages/reports/Reports";
import AIStoreManager from "../pages/ai/AIStoreManager";

/* ─── Route Guards ───────────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

/* ─── App Routes ─────────────────────────────────────────── */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ══════════════════════════════════════
            AUTH ROUTES  (unauthenticated only)
        ═══════════════════════════════════════ */}
        <Route
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ══════════════════════════════════════
            MAIN APP ROUTES  (authenticated only)
        ═══════════════════════════════════════ */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Core */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<Search />} />

          {/* Products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Inventory */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/alerts" element={<InventoryAlerts />} />
          <Route path="/inventory/restock" element={<RestockRecommendations />} />
          <Route path="/inventory/add" element={<AddInventory />} />
          <Route path="/inventory/edit/:id" element={<EditInventory />} />
          <Route path="/inventory/:id" element={<InventoryDetails />} />

          {/* Sales */}
          <Route path="/sales" element={<SalesDashboard />} />
          <Route path="/sales/list" element={<SalesList />} />
          <Route path="/sales/add" element={<AddSale />} />
          <Route path="/sales/edit/:id" element={<EditSale />} />
          <Route path="/sales/:id" element={<SaleDetails />} />
          <Route path="/sales/upload" element={<UploadSales />} />
          <Route path="/sales/analytics" element={<SalesAnalytics />} />

          {/* Forecasting */}
          <Route path="/forecast" element={<Forecasting />} />
          <Route path="/forecasting" element={<Forecasting />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="/ai-manager" element={<AIStoreManager />} />
        {/* ══════════════════════════════════════
            PUBLIC / INFO ROUTES
        ═══════════════════════════════════════ */}
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/apistatus" element={<APIStatus />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* 404 → Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;