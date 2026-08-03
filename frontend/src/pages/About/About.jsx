import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 8 }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.6rem",
                md: "3.3rem",
              },
            }}
          >
            About Smart Retail
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 760,
              fontSize: {
                xs: 16,
                md: 18,
              },
            }}
          >
            Smart Retail Intelligence Platform helps businesses manage
            inventory, monitor sales, forecast demand, and make data-driven
            decisions from one centralized dashboard.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Stack>

        {/* About Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Our Mission
                </Typography>

                <Typography color="text.secondary">
                  To empower retailers with intelligent tools that simplify
                  inventory management, improve sales performance, and support
                  better business decisions through analytics and automation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Our Vision
                </Typography>

                <Typography color="text.secondary">
                  To become a trusted retail intelligence platform that enables
                  businesses of every size to grow using modern technology,
                  predictive insights, and real-time reporting.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  What We Offer
                </Typography>

                <Typography color="text.secondary">
                  • Inventory Management
                  <br />
                  • Sales Tracking
                  <br />
                  • Demand Forecasting
                  <br />
                  • Business Reports
                  <br />
                  • Retail Analytics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Company Overview */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Company Overview
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              lineHeight: 1.9,
              fontSize: 16,
            }}
          >
            Smart Retail Intelligence Platform is designed to help retailers
            streamline daily operations through an easy-to-use dashboard.
            Instead of relying on spreadsheets and manual calculations,
            businesses can manage products, inventory, sales, and reports from
            a single platform.
            <br />
            <br />
            Our goal is to provide actionable insights that help businesses
            reduce stock shortages, optimize inventory levels, and improve
            profitability. The platform combines modern UI, responsive design,
            and scalable architecture to deliver a seamless experience across
            desktop, tablet, and mobile devices.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;