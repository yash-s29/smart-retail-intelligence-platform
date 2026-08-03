import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const InventoryStats = ({ stats = {}, loading = false }) => {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts ?? 0,
      icon: Inventory2RoundedIcon,
      color: "#1976d2",
      bg: "rgba(25,118,210,0.12)",
    },
    {
      title: "In Stock",
      value: stats.inStock ?? 0,
      icon: CheckCircleRoundedIcon,
      color: "#2e7d32",
      bg: "rgba(46,125,50,0.12)",
    },
    {
      title: "Low Stock",
      value: stats.lowStock ?? 0,
      icon: WarningAmberRoundedIcon,
      color: "#ed6c02",
      bg: "rgba(237,108,2,0.12)",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock ?? 0,
      icon: CancelRoundedIcon,
      color: "#d32f2f",
      bg: "rgba(211,47,47,0.12)",
    },
  ];

  return (
    // Plain CSS Grid with gridAutoRows: '1fr' — this forces every card,
    // on every row, to the exact same height at every breakpoint. MUI's
    // <Grid> only matches heights within a single row, which is what was
    // causing cards to look inconsistent across rows on smaller screens.
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gridAutoRows: "1fr",
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            elevation={0}
            sx={{
              height: "100%",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              transition: "all .25s ease",
              backgroundColor: "background.paper",
              display: "flex",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                px: { xs: 1.75, sm: 2.5 },
                py: { xs: 1.5, sm: 2 },
                "&:last-child": {
                  pb: { xs: 1.5, sm: 2 },
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={{ xs: 1, sm: 2 }}
                sx={{ width: "100%" }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: "0.72rem", sm: "0.8rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.title}
                  </Typography>

                  {loading ? (
                    <Skeleton variant="rounded" width={70} height={32} />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        fontSize: {
                          xs: "1.35rem",
                          sm: "1.65rem",
                          md: "1.8rem",
                        },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.value}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    width: { xs: 42, sm: 52, md: 56 },
                    height: { xs: 42, sm: 52, md: 56 },
                    minWidth: { xs: 42, sm: 52, md: 56 },
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: card.bg,
                    color: card.color,
                    transition: "all .25s ease",
                    flexShrink: 0,

                    ".MuiCard-root:hover &": {
                      transform: "scale(1.08) rotate(-6deg)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 22, sm: 26, md: 30 } }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

InventoryStats.propTypes = {
  stats: PropTypes.shape({
    totalProducts: PropTypes.number,
    inStock: PropTypes.number,
    lowStock: PropTypes.number,
    outOfStock: PropTypes.number,
  }),

  loading: PropTypes.bool,
};

InventoryStats.defaultProps = {
  stats: {
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  },

  loading: false,
};

export default InventoryStats;