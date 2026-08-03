import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

export default function Search() {
  const [params] = useSearchParams();

  const query = params.get("q")?.toLowerCase() || "";

  /*
   Temporary local data.
   Later connect API.
  */

  const products = [
    "Organic Milk 1L",
    "Premium Rice 5kg",
    "Festival Gift Box",
    "Cold Brew Coffee",
  ];

  const reports = [
    "Weekly Sales Report",
    "Inventory Forecast",
    "Demand Analytics",
  ];

  const alerts = [
    "Low Stock Organic Milk",
    "Reorder Premium Rice",
    "Stock Up Festival Gift Box",
  ];

  const results = useMemo(() => {
    if (!query) return [];

    const items = [
      ...products.map((item) => ({
        type: "Product",
        title: item,
      })),

      ...reports.map((item) => ({
        type: "Report",
        title: item,
      })),

      ...alerts.map((item) => ({
        type: "Alert",
        title: item,
      })),
    ];

    return items.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [query]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={3}
      >
        Search Results
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Search term: <strong>{query}</strong>
      </Typography>

      <Grid container spacing={2}>
        {results.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography>
                  No results found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          results.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Chip
                    label={item.type}
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}