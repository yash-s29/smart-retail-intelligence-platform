// src/components/inventory/InventoryStats.jsx

import PropTypes from "prop-types";
import { motion } from "framer-motion";

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

/* ============================================================
   Light Sea-Water / Retail UI Palette
============================================================ */

const COLORS = {
  primary: "#2A9DCC",
  primaryDark: "#197FA8",
  primarySoft: "#EAF8FC",

  blue: "#238DB8",
  blueSoft: "#E8F6FB",

  green: "#2E9B73",
  greenSoft: "#EAF8F2",

  amber: "#D99235",
  amberSoft: "#FFF7E8",

  red: "#D85C5C",
  redSoft: "#FFF0F0",

  ink: "#183B4D",
  slate: "#66808D",

  white: "#FFFFFF",
  beige: "#FBFAF6",
  border: "#DDECEF",
};

/* ============================================================
   Animation
============================================================ */

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const iconVariants = {
  initial: {
    rotate: 0,
    scale: 1,
  },

  hover: {
    rotate: -8,
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/* ============================================================
   Component
============================================================ */

const InventoryStats = ({ stats = {}, loading = false }) => {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts ?? 0,
      icon: Inventory2RoundedIcon,
      color: COLORS.blue,
      bg: COLORS.blueSoft,
      accent: COLORS.primary,
    },

    {
      title: "In Stock",
      value: stats.inStock ?? 0,
      icon: CheckCircleRoundedIcon,
      color: COLORS.green,
      bg: COLORS.greenSoft,
      accent: COLORS.green,
    },

    {
      title: "Low Stock",
      value: stats.lowStock ?? 0,
      icon: WarningAmberRoundedIcon,
      color: COLORS.amber,
      bg: COLORS.amberSoft,
      accent: COLORS.amber,
    },

    {
      title: "Out of Stock",
      value: stats.outOfStock ?? 0,
      icon: CancelRoundedIcon,
      color: COLORS.red,
      bg: COLORS.redSoft,
      accent: COLORS.red,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mb: { xs: 2, sm: 2.5, md: 3 },

        display: "grid",

        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },

        gap: {
          xs: 1.25,
          sm: 1.75,
          md: 2,
        },

        alignItems: "stretch",
      }}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              y: -5,
              transition: {
                duration: 0.25,
                ease: "easeOut",
              },
            }}
            style={{
              height: "100%",
              minWidth: 0,
            }}
          >
            <Card
              elevation={0}
              sx={{
                position: "relative",

                width: "100%",
                height: "100%",
                minHeight: {
                  xs: 108,
                  sm: 118,
                  md: 126,
                },

                overflow: "hidden",

                borderRadius: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                },

                border: `1px solid ${COLORS.border}`,

                background: `
                  linear-gradient(
                    145deg,
                    rgba(255,255,255,0.98) 0%,
                    rgba(250,253,253,0.96) 62%,
                    ${COLORS.beige} 100%
                  )
                `,

                boxShadow: `
                  0 5px 18px rgba(31, 94, 112, 0.055),
                  0 1px 3px rgba(31, 94, 112, 0.04)
                `,

                transition:
                  "box-shadow .3s ease, border-color .3s ease, background .3s ease",

                "&:hover": {
                  borderColor: `${card.accent}55`,

                  boxShadow: `
                    0 14px 30px rgba(31, 94, 112, 0.11),
                    0 5px 12px rgba(31, 94, 112, 0.05)
                  `,
                },

                /* Top accent line */
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,

                  background: `
                    linear-gradient(
                      90deg,
                      ${card.accent},
                      ${card.accent}55,
                      transparent
                    )
                  `,

                  opacity: 0.85,
                },

                /* Soft decorative glow */
                "&::after": {
                  content: '""',
                  position: "absolute",

                  width: 90,
                  height: 90,

                  right: -45,
                  bottom: -45,

                  borderRadius: "50%",

                  background: card.bg,

                  opacity: 0.65,

                  pointerEvents: "none",
                },
              }}
            >
              <CardContent
                sx={{
                  position: "relative",
                  zIndex: 1,

                  height: "100%",
                  boxSizing: "border-box",

                  px: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.25,
                  },

                  py: {
                    xs: 1.5,
                    sm: 1.75,
                    md: 2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.5,
                      sm: 1.75,
                      md: 2,
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* ==================================================
                      Text
                  ================================================== */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: COLORS.slate,

                        fontWeight: 700,

                        fontSize: {
                          xs: "0.68rem",
                          sm: "0.74rem",
                          md: "0.78rem",
                        },

                        lineHeight: 1.2,

                        letterSpacing: "0.01em",

                        mb: {
                          xs: 0.5,
                          sm: 0.65,
                        },

                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {card.title}
                    </Typography>

                    {loading ? (
                      <Skeleton
                        variant="rounded"
                        width={64}
                        height={30}
                        animation="wave"
                        sx={{
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          color: COLORS.ink,

                          fontWeight: 850,

                          fontSize: {
                            xs: "1.25rem",
                            sm: "1.45rem",
                            md: "1.65rem",
                          },

                          lineHeight: 1.1,

                          letterSpacing: "-0.035em",

                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {card.value}
                      </Typography>
                    )}

                    {!loading && (
                      <Box
                        sx={{
                          mt: {
                            xs: 0.8,
                            sm: 1,
                          },

                          width: {
                            xs: 24,
                            sm: 30,
                          },

                          height: 3,

                          borderRadius: 99,

                          background: `
                            linear-gradient(
                              90deg,
                              ${card.accent},
                              ${card.accent}22
                            )
                          `,
                        }}
                      />
                    )}
                  </Box>

                  {/* ==================================================
                      Animated Icon
                  ================================================== */}

                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    style={{
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",

                        width: {
                          xs: 42,
                          sm: 48,
                          md: 54,
                        },

                        height: {
                          xs: 42,
                          sm: 48,
                          md: 54,
                        },

                        borderRadius: {
                          xs: "13px",
                          sm: "15px",
                        },

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background: `
                          linear-gradient(
                            145deg,
                            ${card.bg},
                            rgba(255,255,255,0.95)
                          )
                        `,

                        color: card.color,

                        border: `1px solid ${card.accent}20`,

                        boxShadow: `
                          0 5px 14px ${card.accent}12,
                          inset 0 1px 0 rgba(255,255,255,.8)
                        `,

                        transition:
                          "box-shadow .3s ease, background .3s ease",

                        "&:hover": {
                          boxShadow: `
                            0 8px 20px ${card.accent}22,
                            inset 0 1px 0 rgba(255,255,255,.9)
                          `,
                        },

                        "&::before": {
                          content: '""',
                          position: "absolute",

                          inset: 4,

                          borderRadius: {
                            xs: "10px",
                            sm: "12px",
                          },

                          border: `1px dashed ${card.accent}25`,

                          opacity: 0.8,
                        },
                      }}
                    >
                      <Icon
                        sx={{
                          position: "relative",
                          zIndex: 1,

                          fontSize: {
                            xs: 21,
                            sm: 24,
                            md: 27,
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </Box>
  );
};

/* ============================================================
   PropTypes
============================================================ */

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
