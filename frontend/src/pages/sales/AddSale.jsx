import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { PrimaryButton, FormField } from '../../components/ui';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CustomerForm from "../../components/sales/CustomerForm";
import ProductSelector from "../../components/sales/ProductSelector";
import InvoiceSummary from "../../components/sales/InvoiceSummary";

import salesApi from "../../services/salesApi";
import * as productApi from "../../services/productApi";

const AddSale = () => {
  const navigate = useNavigate();

  /* ======================================================
      State Management
  ====================================================== */

  // Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  // Selected Product & Sale Details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Customer Data
  const [customerData, setCustomerData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

/* ======================================================
      Load Products
  ====================================================== */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        
        // 👇 CHANGED: Updated to match your productApi.js (getProducts instead of getAllProducts)
        const response = await productApi.getProducts(); 
        
        // Note: Axios wraps the response in a 'data' object, so we use response.data
        const data = response.data || response; 

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("API Error details:", error);
        
        const errorMsg = error?.response?.data?.detail || error?.message || "Unable to load products.";
        setProductError(`Error: ${errorMsg}. Please check your backend connection.`);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* ======================================================
      Handlers
  ====================================================== */

  const handleCustomerChange = (e) => {
    setCustomerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (selectedProduct?.inventory && value > selectedProduct.inventory.current_stock) {
      setQuantity(selectedProduct.inventory.current_stock);
      return;
    }

    setQuantity(value);
  };

  /* ======================================================
      Submit Sale
  ====================================================== */

  const handleSubmitSale = async () => {
    setSubmitError("");

    if (!selectedProduct) {
      setSubmitError("Please select a product.");
      return;
    }

    if (quantity <= 0) {
      setSubmitError("Quantity must be greater than zero.");
      return;
    }

    if (selectedProduct.inventory && quantity > selectedProduct.inventory.current_stock) {
      setSubmitError("Quantity exceeds available stock.");
      return;
    }

    const salePayload = {
      product_id: selectedProduct.id,
      quantity_sold: quantity,
      unit_price: selectedProduct.selling_price,
      customer_name: customerData.customer_name || null,
      customer_phone: customerData.customer_phone || null,
      customer_email: customerData.customer_email || null,
      payment_method: paymentMethod,
      status: "Completed",
    };

    try {
      setIsSubmitting(true);
      await salesApi.createSale(salePayload);
      navigate("/sales", { replace: true });
    } catch (error) {
      console.error(error);
      setSubmitError(error?.response?.data?.detail || "Failed to create sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================================================
      Render
  ====================================================== */

  if (loadingProducts) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productError) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 5 }}>
          {productError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      {/* ================= Header ================= */}
      <PrimaryButton
        variant="text"
        startIcon={<ArrowLeft size={18} />}
        onClick={() => navigate("/sales")}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Back to Sales
      </PrimaryButton>

      <Typography variant="h4" fontWeight={700} mb={1}>
        Create New Sale
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Create a sales transaction. Inventory will be updated automatically after the sale is completed.
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* ================= Left Side ================= */}
        <Grid item xs={12} lg={8}>
          
          {/* Customer */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <CustomerForm customerData={customerData} onChange={handleCustomerChange} />
          </Paper>

          {/* Product */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Product Information
            </Typography>

            <ProductSelector
              products={products}
              loading={loadingProducts}
              error={productError}
              onSelect={handleProductSelect}
            />

            {selectedProduct && (
              <Box mt={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                        <FormField
                          fullWidth
                          type="number"
                          label="Quantity"
                          value={quantity}
                          onChange={handleQuantityChange}
                          inputProps={{ min: 1, max: selectedProduct.inventory?.current_stock || 1 }}
                        />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormField fullWidth select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                      <MenuItem value="Net Banking">Net Banking</MenuItem>
                    </FormField>
                  </Grid>

                  <Grid item xs={12}>
                    <Alert severity="info">
                      <strong>Available Stock:</strong> {selectedProduct.inventory?.current_stock}
                    </Alert>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ================= Right Side ================= */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: { xs: "static", lg: "sticky" }, top: { lg: "var(--navbar-height)" } }}>
            <InvoiceSummary
              product={selectedProduct}
              quantity={quantity}
              paymentMethod={paymentMethod}
              customer={customerData}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitSale}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddSale;