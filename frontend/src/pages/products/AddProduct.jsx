// src/pages/products/AddProduct.jsx
// POST /products  →  ProductCreate schema
// Fields: name, category, sku, selling_price, cost_price,
//         current_stock, reorder_level, safety_stock

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { motion } from "framer-motion";

import { PrimaryButton } from "../../components/ui";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { createProduct } from "../../services/productApi";
import ProductForm from "../../components/products/ProductForm";
import { COLORS } from "../../components/products/shared";

/* ============================================================
   DEFAULT FORM STATE
============================================================ */

const DEFAULT = {
  name: "",
  category: "",
  sku: "",
  selling_price: "",
  cost_price: "0",
  current_stock: "0",
  reorder_level: "10",
  safety_stock: "20",
};

/* ============================================================
   VALIDATION
============================================================ */

function validate(form) {
  const errs = {};

  if (!form.name.trim()) {
    errs.name = "Name is required (1–160 chars).";
  }

  if (!form.selling_price || parseFloat(form.selling_price) <= 0) {
    errs.selling_price = "Selling price must be > 0.";
  }

  if (form.cost_price !== "" && parseFloat(form.cost_price) < 0) {
    errs.cost_price = "Cost price cannot be negative.";
  }

  if (form.current_stock !== "" && parseInt(form.current_stock) < 0) {
    errs.current_stock = "Stock cannot be negative.";
  }

  if (form.reorder_level !== "" && parseInt(form.reorder_level) < 0) {
    errs.reorder_level = "Reorder level cannot be negative.";
  }

  if (form.safety_stock !== "" && parseInt(form.safety_stock) < 0) {
    errs.safety_stock = "Safety stock cannot be negative.";
  }

  return errs;
}

/* ============================================================
   PAGE ANIMATION
============================================================ */

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/* ============================================================
   ADD PRODUCT
============================================================ */

export default function AddProduct() {
  const navigate = useNavigate();

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  const [form, setForm] = useState(DEFAULT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState(null);
  const [success, setSuccess] = useState(false);

  /* ==========================================================
     HANDLE CHANGE
  ========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((er) => ({
        ...er,
        [name]: undefined,
      }));
    }
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async () => {
    const errs = validate(form);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setApiErr(null);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category || null,
        sku: form.sku.trim() || null,
        selling_price: parseFloat(form.selling_price),
        cost_price: parseFloat(form.cost_price || 0),
        current_stock: parseInt(form.current_stock || 0),
        reorder_level: parseInt(form.reorder_level || 10),
        safety_stock: parseInt(form.safety_stock || 20),
      };

      await createProduct(payload);

      setSuccess(true);

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      const detail = err?.response?.data?.detail;

      setApiErr(
        typeof detail === "string"
          ? detail
          : "Failed to create product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     BUTTON STYLE
  ========================================================== */

  const btnSx = {
    minHeight: 40,
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: {
      xs: "0.76rem",
      sm: "0.78rem",
    },
    textTransform: "none",
    letterSpacing: "-0.01em",

    transition:
      "transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease",

    "&:active": {
      transform: "scale(0.98)",
    },
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",

        px: {
          xs: 0,
          sm: 0.5,
          md: 1,
        },

        pb: {
          xs: 9,
          sm: 2,
        },

        position: "relative",
      }}
    >
      {/* ======================================================
          BACKGROUND ATMOSPHERE
      ====================================================== */}

      <Box
        sx={{
          position: "fixed",
          top: {
            xs: 80,
            md: 120,
          },

          right: {
            xs: -150,
            md: -100,
          },

          width: {
            xs: 280,
            md: 420,
          },

          height: {
            xs: 280,
            md: 420,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.035) 42%, transparent 72%)",

          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "fixed",

          bottom: -150,
          left: -120,

          width: 360,
          height: 360,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(20,184,166,0.07) 0%, rgba(20,184,166,0.025) 42%, transparent 72%)",

          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ======================================================
          MAIN PAGE
      ====================================================== */}

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <motion.div variants={itemVariants}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            spacing={{
              xs: 1.5,
              sm: 2,
            }}
            sx={{
              mb: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            {/* LEFT SIDE */}

            <Box sx={{ minWidth: 0 }}>
              {/* Back navigation */}

              <PrimaryButton
                variant="text"
                startIcon={
                  <ArrowBackIcon
                    sx={{
                      fontSize: "15px !important",
                    }}
                  />
                }
                onClick={() => navigate("/products")}
                sx={{
                  minHeight: 30,
                  mb: 0.5,

                  pl: 0,
                  pr: 1,

                  color: COLORS.slate,

                  fontSize: {
                    xs: "0.72rem",
                    sm: "0.74rem",
                  },

                  fontWeight: 650,

                  "&:hover": {
                    color: COLORS.primary,
                    bgcolor: "transparent",

                    "& .MuiButton-startIcon": {
                      transform: "translateX(-3px)",
                    },
                  },

                  "& .MuiButton-startIcon": {
                    transition: "transform .2s ease",
                  },
                }}
              >
                Back to products
              </PrimaryButton>

              {/* Title */}

              <Stack
                direction="row"
                spacing={1.1}
                alignItems="center"
              >
                {/* Animated icon */}

                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotate: [0, 360],
                        }
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: 38,
                    height: 38,

                    borderRadius: 11,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,

                    color: COLORS.primary,

                    background:
                      "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(255,255,255,0.96))",

                    border: `1px solid ${
                      COLORS.primary
                    }2A`,

                    boxShadow:
                      "0 5px 16px rgba(14,165,233,0.10)",
                  }}
                >
                  <Inventory2RoundedIcon
                    sx={{
                      fontSize: 19,
                    }}
                  />
                </motion.div>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: {
                        xs: "1.18rem",
                        sm: "1.35rem",
                        md: "1.45rem",
                      },

                      fontWeight: 850,

                      color: COLORS.ink,

                      letterSpacing: "-0.025em",

                      lineHeight: 1.15,

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add product
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.68rem",
                        sm: "0.72rem",
                      },

                      color: COLORS.slate,

                      mt: 0.25,
                    }}
                  >
                    Add a product to your inventory
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* ==================================================
                DESKTOP ACTIONS
            ================================================== */}

            <Stack
              direction="row"
              spacing={0.9}
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },

                flexShrink: 0,
              }}
            >
              <PrimaryButton
                variant="outlined"
                onClick={() => navigate("/products")}
                sx={{
                  ...btnSx,

                  px: 1.8,

                  borderColor: COLORS.border,

                  color: COLORS.slate,

                  bgcolor: "rgba(255,255,255,0.72)",

                  "&:hover": {
                    borderColor: COLORS.aqua,
                    bgcolor: COLORS.aquaSoft,

                    transform: "translateY(-1px)",
                  },
                }}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                variant="contained"
                disableElevation
                startIcon={
                  saving ? null : (
                    <SaveOutlinedIcon
                      sx={{
                        fontSize: "16px !important",
                      }}
                    />
                  )
                }
                onClick={handleSubmit}
                disabled={saving}
                sx={{
                  ...btnSx,

                  px: 2.2,

                  color: "#fff",

                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",

                  boxShadow:
                    "0 7px 18px rgba(14,165,233,0.23)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",

                    transform: "translateY(-2px)",

                    boxShadow:
                      "0 10px 24px rgba(14,165,233,0.30)",
                  },
                }}
              >
                {saving ? "Saving…" : "Save product"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </motion.div>

        {/* ====================================================
            API ERROR
        ==================================================== */}

        {apiErr && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Alert
              severity="error"
              onClose={() => setApiErr(null)}
              sx={{
                mb: 1.5,

                borderRadius: "11px",

                border: "1px solid rgba(239,68,68,0.15)",

                fontSize: "0.78rem",

                boxShadow:
                  "0 4px 14px rgba(239,68,68,0.06)",
              }}
            >
              {apiErr}
            </Alert>
          </motion.div>
        )}

        {/* ====================================================
            FORM CARD
        ==================================================== */}

        <motion.div variants={itemVariants}>
          <Card
            elevation={0}
            sx={{
              position: "relative",

              overflow: "hidden",

              borderRadius: {
                xs: "15px",
                sm: "18px",
                md: "20px",
              },

              border:
                "1px solid rgba(148,163,184,0.20)",

              bgcolor:
                "rgba(255,255,255,0.88)",

              backdropFilter: "blur(16px)",

              boxShadow:
                "0 8px 30px rgba(15,23,42,0.055)",

              transition:
                "transform .3s ease, box-shadow .3s ease, border-color .3s ease",

              "&:hover": {
                borderColor:
                  "rgba(14,165,233,0.22)",

                boxShadow:
                  "0 14px 38px rgba(15,23,42,0.075)",
              },

              /* subtle texture */

              "&::before": {
                content: '""',

                position: "absolute",

                top: 0,
                right: 0,

                width: 240,
                height: 180,

                background:
                  "radial-gradient(circle at top right, rgba(14,165,233,0.10), transparent 68%)",

                pointerEvents: "none",
              },

              "&::after": {
                content: '""',

                position: "absolute",

                bottom: 0,
                left: 0,

                width: 220,
                height: 160,

                background:
                  "radial-gradient(circle at bottom left, rgba(20,184,166,0.055), transparent 70%)",

                pointerEvents: "none",
              },
            }}
          >
            {/* TOP ACCENT */}

            <Box
              sx={{
                position: "absolute",

                top: 0,
                left: 0,
                right: 0,

                height: 3,

                background:
                  "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 45%, #14b8a6 100%)",

                zIndex: 2,
              }}
            />

            <CardContent
              sx={{
                position: "relative",

                zIndex: 1,

                p: {
                  xs: 1.5,
                  sm: 2.25,
                  md: 2.75,
                  lg: 3,
                },

                "&:last-child": {
                  pb: {
                    xs: 1.5,
                    sm: 2.25,
                    md: 2.75,
                    lg: 3,
                  },
                },
              }}
            >
              {/* =================================================
                  FORM CONTENT

                  ProductForm remains completely unchanged.
                  Only the surrounding UI is enhanced.
              ================================================= */}

              <Box
                sx={{
                  "& .MuiTextField-root": {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",

                      backgroundColor:
                        "rgba(255,255,255,0.78)",

                      transition:
                        "box-shadow .2s ease, border-color .2s ease, transform .2s ease",

                      "&:hover": {
                        backgroundColor: "#fff",
                      },

                      "&.Mui-focused": {
                        boxShadow:
                          "0 0 0 3px rgba(14,165,233,0.08)",

                        transform: "translateY(-1px)",
                      },
                    },
                  },

                  "& .MuiFormLabel-root": {
                    fontSize: "0.82rem",
                  },

                  "& .MuiInputBase-input": {
                    fontSize: "0.82rem",
                  },

                  "& .MuiFormHelperText-root": {
                    fontSize: "0.68rem",
                  },
                }}
              >
                <ProductForm
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                  isEdit={false}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* ====================================================
            SMALL INFORMATION STRIP
        ==================================================== */}

        <motion.div variants={itemVariants}>
          <Box
            sx={{
              mt: 1.25,

              display: {
                xs: "none",
                sm: "flex",
              },

              alignItems: "center",

              gap: 0.75,

              px: 1.25,
              py: 0.8,

              borderRadius: "9px",

              background:
                "linear-gradient(90deg, rgba(240,249,255,0.82), rgba(255,255,255,0.72))",

              border:
                "1px solid rgba(14,165,233,0.10)",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: 15,
                color: "#0ea5e9",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.68rem",

                color: COLORS.slate,

                lineHeight: 1.4,
              }}
            >
              Product details are validated before being saved.
            </Typography>
          </Box>
        </motion.div>
      </motion.div>

      {/* ======================================================
          MOBILE STICKY ACTION BAR
      ====================================================== */}

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

          position: "fixed",

          left: 0,
          right: 0,

          bottom: 0,

          zIndex: 1200,

          px: 1.25,
          py: 1,

          bgcolor:
            "rgba(255,255,255,0.94)",

          backdropFilter: "blur(18px)",

          borderTop:
            "1px solid rgba(148,163,184,0.20)",

          boxShadow:
            "0 -8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <PrimaryButton
            fullWidth
            variant="outlined"
            onClick={() => navigate("/products")}
            sx={{
              ...btnSx,

              minHeight: 43,

              borderColor: COLORS.border,

              color: COLORS.slate,

              bgcolor: "#fff",

              "&:hover": {
                borderColor: COLORS.aqua,
                bgcolor: COLORS.aquaSoft,
              },
            }}
          >
            Cancel
          </PrimaryButton>

          <PrimaryButton
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={saving}
            startIcon={
              saving ? null : (
                <SaveOutlinedIcon
                  sx={{
                    fontSize: "16px !important",
                  }}
                />
              )
            }
            sx={{
              ...btnSx,

              minHeight: 43,

              color: "#fff",

              background:
                "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",

              boxShadow:
                "0 6px 16px rgba(14,165,233,0.22)",

              "&:hover": {
                background:
                  "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              },
            }}
          >
            {saving ? "Saving…" : "Save product"}
          </PrimaryButton>
        </Stack>
      </Box>

      {/* ======================================================
          SUCCESS SNACKBAR
      ====================================================== */}

      <Snackbar
        open={success}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          icon={
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: 19,
              }}
            />
          }
          sx={{
            borderRadius: "11px",

            fontWeight: 650,

            fontSize: "0.78rem",

            border:
              "1px solid rgba(34,197,94,0.15)",

            boxShadow:
              "0 8px 25px rgba(15,23,42,0.12)",
          }}
        >
          Product created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
