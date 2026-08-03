import React from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Search,
  RotateCcw,
} from "lucide-react";

const SalesFilters = ({
  filters = {}, // Added default empty object
  setFilters,
  onClearFilters,
}) => {
  const handleChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Box
      mb={4}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          lg: "row",
        }}
        spacing={2}
        // Moved responsive alignment into sx to fix Prop Warning
        sx={{
          alignItems: {
            xs: "stretch",
            lg: "center",
          },
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search product or customer..."
          value={filters?.search || ""} // Safe access
          onChange={handleChange("search")}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 52,
            },
          }}
        />

        {/* Status */}
        <TextField
          select
          label="Status"
          value={filters?.status || ""} // Safe access
          onChange={handleChange("status")}
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 52,
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
          <MenuItem value="Refunded">Refunded</MenuItem>
        </TextField>

        {/* Payment */}
        <TextField
          select
          label="Payment"
          value={filters?.payment_method || ""} // Safe access
          onChange={handleChange("payment_method")}
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 52,
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Card">Card</MenuItem>
          <MenuItem value="UPI">UPI</MenuItem>
        </TextField>

        {/* From */}
        <TextField
          type="date"
          label="From"
          value={filters?.start_date || ""} // Safe access
          onChange={handleChange("start_date")}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 52,
            },
          }}
        />

        {/* To */}
        <TextField
          type="date"
          label="To"
          value={filters?.end_date || ""} // Safe access
          onChange={handleChange("end_date")}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            minWidth: 170,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 52,
            },
          }}
        />

        {/* Clear */}
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClearFilters}
          startIcon={<RotateCcw size={18} />}
          sx={{
            height: 52,
            minWidth: 150,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default SalesFilters;