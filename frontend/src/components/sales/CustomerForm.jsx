import React from "react";

import {
  Alert,
  Box,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Mail,
  Phone,
  User,
} from "lucide-react";

const CustomerForm = ({
  customerData = {},
  onChange,
  errors = {},
}) => {
  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Customer Information
      </Typography>

      <Grid
        container
        spacing={3}
      >
        {/* Customer Name */}

        <Grid
          item
          xs={12}
          md={6}
        >
          <TextField
            fullWidth
            required
            name="customer_name"
            label="Customer Name"
            placeholder="Enter customer name"
            value={
              customerData.customer_name || ""
            }
            onChange={onChange}
            error={Boolean(errors.customer_name)}
            helperText={
              errors.customer_name
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                borderRadius: 3,
              },
            }}
          />
        </Grid>

        {/* Phone */}

        <Grid
          item
          xs={12}
          md={6}
        >
          <TextField
            fullWidth
            name="customer_phone"
            label="Phone Number"
            placeholder="+91 9876543210"
            value={
              customerData.customer_phone ||
              ""
            }
            onChange={onChange}
            error={Boolean(errors.customer_phone)}
            helperText={
              errors.customer_phone
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone size={18} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                borderRadius: 3,
              },
            }}
          />
        </Grid>

        {/* Email */}

        <Grid
          item
          xs={12}
        >
          <TextField
            fullWidth
            name="customer_email"
            type="email"
            label="Email Address"
            placeholder="customer@example.com"
            value={
              customerData.customer_email ||
              ""
            }
            onChange={onChange}
            error={Boolean(errors.customer_email)}
            helperText={
              errors.customer_email
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                borderRadius: 3,
              },
            }}
          />
        </Grid>
      </Grid>

      <Stack
        spacing={2}
        mt={3}
      >
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
          }}
        >
          Phone number and email are optional for walk-in
          customers.
        </Alert>

        <Alert
          severity="success"
          sx={{
            borderRadius: 2,
          }}
        >
          Customer information will be stored with the sale
          and displayed in invoices, sales history, and
          reports.
        </Alert>
      </Stack>
    </Box>
  );
};

export default CustomerForm;