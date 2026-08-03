import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PrimaryButton, FormField } from '../../components/ui';

import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import CustomerForm from "../../components/sales/CustomerForm";
import salesApi from "../../services/salesApi";

function EditSale() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    total_amount: "",
  });

  /* ======================================================
      Fetch Sale
  ====================================================== */

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);

        // Uncomment when backend is ready
        // const sale = await salesApi.getSaleById(id);

        // Temporary mock
        const sale = {
          customer_name: "Walk-in Customer",
          customer_phone: "",
          customer_email: "",
          total_amount: 120,
        };

        setFormData({
          customer_name: sale.customer_name || "",
          customer_phone: sale.customer_phone || "",
          customer_email: sale.customer_email || "",
          total_amount: sale.total_amount || "",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load sale.");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  /* ======================================================
      Input Change
  ====================================================== */

  const handleCustomerChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAmountChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      total_amount: e.target.value,
    }));
  };

  /* ======================================================
      Save
  ====================================================== */

  const handleUpdate = async () => {
    if (!formData.customer_name.trim()) {
      setError("Customer name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Uncomment after backend ready
      /*
      await salesApi.updateSale(id,{
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          total_amount:Number(formData.total_amount)
      });
      */

      console.log("Updated Sale", id, formData);

      navigate(`/sales/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update sale.");
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================
      Loading
  ====================================================== */

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  /* ======================================================
      UI
  ====================================================== */

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <PrimaryButton variant="text" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3, textTransform: "none" }}>
        Back
      </PrimaryButton>

      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Edit Sale
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Update sale information.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CustomerForm
          customerData={formData}
          onChange={handleCustomerChange}
        />

        <Box mt={4}>
          <FormField fullWidth type="number" label="Total Amount" value={formData.total_amount} onChange={handleAmountChange} />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          mt={5}
        >
          <PrimaryButton variant="outlined" onClick={() => navigate(-1)}>Cancel</PrimaryButton>

          <PrimaryButton variant="contained" startIcon={<Save size={18} />} onClick={handleUpdate} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </Stack>
      </Paper>
    </Container>
  );
}

export default EditSale;