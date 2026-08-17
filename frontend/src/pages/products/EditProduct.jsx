// src/pages/products/EditProduct.jsx
// GET /products/{id}  then  PUT /products/{id}  →  ProductUpdate schema
// Only name, category, sku, selling_price, cost_price are updatable.

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { PrimaryButton } from "../../components/ui";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { motion } from "framer-motion";

import {
  getProduct,
  updateProduct,
} from "../../services/productApi";

import ProductForm from "../../components/products/ProductForm";

/* ============================================================
   COLOR SYSTEM
   Light sea-water / soft blue / white / subtle beige
============================================================ */

const COLORS = {
  primary: "#4F9DB8",
  primaryDark: "#3B849F",
  primaryDeep: "#286F8A",

  aqua: "#DDF3F7",
  aquaSoft: "#EEF9FB",
  aquaPale: "#F6FCFD",

  blueSoft: "#EAF6FA",
  blueBorder: "#CBE8EF",

  ink: "#18323B",
  slate: "#647982",
  muted: "#8A9BA1",

  white: "#FFFFFF",

  beige: "#FAF8F2",
  beigeSoft: "#FDFCF8",

  border: "#DCE8EB",

  success: "#2E9B73",
  successSoft: "#EAF8F2",

  error: "#D95D5D",
  errorSoft: "#FFF3F3",
};

/* ============================================================
   Animation Variants
============================================================ */

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 14,
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
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -7, 0],
    rotate: [0, 1.5, 0],

    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ============================================================
   Validation
============================================================ */

function validate(form) {
  const errs = {};

  if (!form.name?.trim()) {
    errs.name = "Name is required (1–160 chars).";
  }

  if (
    !form.selling_price ||
    parseFloat(form.selling_price) <= 0
  ) {
    errs.selling_price = "Selling price must be > 0.";
  }

  if (
    form.cost_price !== "" &&
    parseFloat(form.cost_price) < 0
  ) {
    errs.cost_price = "Cost price cannot be negative.";
  }

  return errs;
}

/* ============================================================
   Header Skeleton
============================================================ */

function HeaderSkeleton() {
  return (
    <Box
      sx={{
        mb: 2.5,
        p: {
          xs: 1.5,
          sm: 2,
        },

        borderRadius: "18px",

        background: COLORS.white,

        border: `1px solid ${COLORS.border}`,

        boxShadow: "0 5px 22px rgba(41, 91, 105, 0.055)",
      }}
    >
      <Skeleton
        width={130}
        height={28}
        sx={{
          mb: 0.5,
          borderRadius: 1,
        }}
      />

      <Skeleton
        width={250}
        height={34}
        sx={{
          borderRadius: 1,
        }}
      />

      <Skeleton
        width={300}
        height={22}
        sx={{
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

/* ============================================================
   Animated Product Icon
============================================================ */

function ProductIcon({ reducedMotion }) {
  return (
    <motion.div
      variants={floatingVariants}
      animate={reducedMotion ? {} : "animate"}
      style={{
        width: 42,
        height: 42,

        flexShrink: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 13,

        background: `linear-gradient(
          135deg,
          ${COLORS.aqua},
          ${COLORS.white}
        )`,

        border: `1px solid ${COLORS.blueBorder}`,

        boxShadow:
          "0 7px 18px rgba(65, 139, 158, 0.12)",
      }}
    >
      <motion.div
        animate={
          reducedMotion
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Inventory2RoundedIcon
          sx={{
            fontSize: 21,
            color: COLORS.primary,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Main Component
============================================================ */

export default function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fetchErr, setFetchErr] = useState(null);
  const [apiErr, setApiErr] = useState(null);

  const [success, setSuccess] = useState(false);

  /* ----------------------------------------------------------
     Fetch product
  ---------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setFetchErr(null);

      try {
        const res = await getProduct(id);

        if (!mounted) return;

        const p = res.data;

        setForm({
          name: p.name ?? "",
          category: p.category ?? "",
          sku: p.sku ?? "",
          selling_price: String(
            p.selling_price ?? ""
          ),
          cost_price: String(
            p.cost_price ?? 0
          ),
        });
      } catch {
        if (!mounted) return;

        setFetchErr(
          "Could not load product. It may have been deleted."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ----------------------------------------------------------
     Form change
  ---------------------------------------------------------- */

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

    if (apiErr) {
      setApiErr(null);
    }
  };

  /* ----------------------------------------------------------
     Submit
  ---------------------------------------------------------- */

  const handleSubmit = async () => {
    if (!form) return;

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

        category:
          form.category || null,

        sku:
          form.sku.trim() || null,

        selling_price:
          parseFloat(form.selling_price),

        cost_price:
          parseFloat(form.cost_price || 0),
      };

      await updateProduct(id, payload);

      setSuccess(true);

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      const detail =
        err?.response?.data?.detail;

      setApiErr(
        typeof detail === "string"
          ? detail
          : "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     Reduced motion
  ========================================================== */

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  /* ==========================================================
     Fetch Error
  ========================================================== */

  if (fetchErr) {
    return (
      <Box
        component={motion.div}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        sx={{
          width: "100%",
          maxWidth: 620,
          mx: "auto",

          pt: {
            xs: 1,
            sm: 3,
          },

          px: {
            xs: 0.5,
            sm: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",

            p: {
              xs: 2,
              sm: 3,
            },

            borderRadius: "18px",

            background:
              "linear-gradient(145deg, #FFFFFF 0%, #FDFCF8 100%)",

            border: `1px solid ${COLORS.border}`,

            boxShadow:
              "0 10px 35px rgba(41, 91, 105, 0.08)",

            "&::before": {
              content: '""',

              position: "absolute",

              width: 170,
              height: 170,

              right: -90,
              top: -90,

              borderRadius: "50%",

              background:
                "radial-gradient(circle, rgba(79,157,184,0.13), transparent 70%)",

              pointerEvents: "none",
            },
          }}
        >
          <Alert
            severity="error"
            icon={
              <InfoOutlinedIcon
                sx={{ fontSize: 19 }}
              />
            }
            sx={{
              borderRadius: "12px",

              backgroundColor:
                COLORS.errorSoft,

              color: COLORS.error,

              border: "1px solid #F4D7D7",

              fontSize: ".82rem",

              "& .MuiAlert-icon": {
                color: COLORS.error,
              },
            }}
          >
            {fetchErr}
          </Alert>

          <Button
            startIcon={
              <ArrowBackIcon
                sx={{ fontSize: 17 }}
              />
            }
            onClick={() =>
              navigate("/products")
            }
            sx={{
              mt: 2,

              minHeight: 42,

              borderRadius: "10px",

              px: 1.75,

              color: COLORS.primaryDark,

              fontSize: ".8rem",

              fontWeight: 750,

              textTransform: "none",

              "&:hover": {
                bgcolor: COLORS.aquaSoft,
              },
            }}
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    );
  }

  /* ==========================================================
     Main UI
  ========================================================== */

  return (
    <Box
      sx={{
        position: "relative",

        width: "100%",

        maxWidth: 900,

        mx: "auto",

        pb: {
          xs: 9,
          sm: 3,
        },

        overflow: "hidden",
      }}
    >
      {/* ======================================================
          Decorative Floating Background
      ====================================================== */}

      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -10, 0],
                x: [0, 4, 0],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",

          width: 180,
          height: 180,

          right: -110,
          top: 30,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(79,157,184,0.10), rgba(79,157,184,0.025) 45%, transparent 70%)",

          pointerEvents: "none",

          zIndex: 0,
        }}
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 9, 0],
                x: [0, -3, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",

          width: 160,
          height: 160,

          left: -120,
          top: 260,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(226,211,177,0.13), transparent 70%)",

          pointerEvents: "none",

          zIndex: 0,
        }}
      />

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

        {loading ? (
          <HeaderSkeleton />
        ) : (
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                position: "relative",

                overflow: "hidden",

                mb: {
                  xs: 1.75,
                  sm: 2.25,
                },

                p: {
                  xs: 1.5,
                  sm: 2,
                  md: 2.25,
                },

                borderRadius: {
                  xs: "16px",
                  sm: "18px",
                },

                background:
                  "linear-gradient(145deg, #FFFFFF 0%, #FAFCFC 70%, #FDFBF6 100%)",

                border:
                  `1px solid ${COLORS.border}`,

                boxShadow:
                  "0 7px 28px rgba(41, 91, 105, 0.065)",

                "&::before": {
                  content: '""',

                  position: "absolute",

                  top: 0,
                  left: 0,
                  right: 0,

                  height: 3,

                  background:
                    "linear-gradient(90deg, #4F9DB8 0%, #74C6D2 50%, #A8DDE2 100%)",
                },

                "&::after": {
                  content: '""',

                  position: "absolute",

                  width: 180,
                  height: 180,

                  right: -95,
                  top: -100,

                  borderRadius: "50%",

                  background:
                    "radial-gradient(circle, rgba(79,157,184,0.10), transparent 70%)",

                  pointerEvents: "none",
                },
              }}
            >
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
              >
                {/* Left Header */}

                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <ProductIcon
                    reducedMotion={
                      prefersReducedMotion
                    }
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Button
                      variant="text"
                      startIcon={
                        <ArrowBackIcon
                          sx={{
                            fontSize: 15,
                          }}
                        />
                      }
                      onClick={() =>
                        navigate("/products")
                      }
                      sx={{
                        minHeight: 24,

                        p: 0,

                        mb: 0.25,

                        color:
                          COLORS.primaryDark,

                        fontSize: ".7rem",

                        fontWeight: 700,

                        textTransform: "none",

                        justifyContent:
                          "flex-start",

                        "&:hover": {
                          bgcolor:
                            "transparent",

                          color:
                            COLORS.primaryDeep,

                          transform:
                            "translateX(-2px)",
                        },

                        transition:
                          "all .2s ease",
                      }}
                    >
                      Back to products
                    </Button>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.7}
                    >
                      <Typography
                        component="h1"
                        sx={{
                          fontSize: {
                            xs: "1.12rem",
                            sm: "1.3rem",
                            md: "1.4rem",
                          },

                          fontWeight: 850,

                          lineHeight: 1.15,

                          color: COLORS.ink,

                          letterSpacing:
                            "-.025em",

                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit product
                      </Typography>

                      <motion.div
                        animate={
                          prefersReducedMotion
                            ? {}
                            : {
                                rotate: [
                                  0,
                                  -8,
                                  8,
                                  0,
                                ],
                              }
                        }
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        }}
                        style={{
                          display: "flex",
                        }}
                      >
                        <EditRoundedIcon
                          sx={{
                            fontSize: {
                              xs: 17,
                              sm: 18,
                            },

                            color:
                              COLORS.primary,
                          }}
                        />
                      </motion.div>
                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.25,

                        fontSize: {
                          xs: ".68rem",
                          sm: ".72rem",
                        },

                        color:
                          COLORS.slate,

                        lineHeight: 1.35,
                      }}
                    >
                      Update product details
                    </Typography>
                  </Box>
                </Stack>

                {/* Desktop Actions */}

                <Stack
                  direction="row"
                  spacing={0.8}
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
                    onClick={() =>
                      navigate("/products")
                    }
                    sx={{
                      minHeight: 40,

                      px: 1.6,

                      borderRadius: "10px",

                      borderColor:
                        COLORS.border,

                      color: COLORS.slate,

                      backgroundColor:
                        COLORS.white,

                      fontSize: ".76rem",

                      fontWeight: 700,

                      textTransform: "none",

                      "&:hover": {
                        borderColor:
                          COLORS.primary,

                        backgroundColor:
                          COLORS.aquaSoft,

                        color:
                          COLORS.primaryDark,
                      },
                    }}
                  >
                    Cancel
                  </PrimaryButton>

                  <PrimaryButton
                    variant="contained"
                    disableElevation
                    startIcon={
                      saving ? (
                        <CircularProgress
                          size={15}
                          color="inherit"
                        />
                      ) : (
                        <SaveOutlinedIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      )
                    }
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{
                      minHeight: 40,

                      px: 1.8,

                      borderRadius: "10px",

                      fontSize: ".76rem",

                      fontWeight: 750,

                      textTransform: "none",

                      color: COLORS.white,

                      background:
                        `linear-gradient(
                          135deg,
                          ${COLORS.primary},
                          ${COLORS.primaryDark}
                        )`,

                      boxShadow:
                        "0 6px 16px rgba(79,157,184,0.23)",

                      transition:
                        "all .22s ease",

                      "&:hover": {
                        background:
                          `linear-gradient(
                            135deg,
                            ${COLORS.primaryDark},
                            ${COLORS.primaryDeep}
                          )`,

                        transform:
                          "translateY(-2px)",

                        boxShadow:
                          "0 10px 23px rgba(79,157,184,0.29)",
                      },

                      "&:active": {
                        transform:
                          "scale(.98)",
                      },
                    }}
                  >
                    {saving
                      ? "Saving…"
                      : "Save changes"}
                  </PrimaryButton>
                </Stack>
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* ====================================================
            API ERROR
        ==================================================== */}

        {apiErr && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Alert
              severity="error"
              onClose={() =>
                setApiErr(null)
              }
              icon={
                <InfoOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              }
              sx={{
                mb: 1.75,

                borderRadius: "12px",

                backgroundColor:
                  COLORS.errorSoft,

                border:
                  "1px solid #F1D6D6",

                color: COLORS.error,

                fontSize: ".76rem",

                "& .MuiAlert-icon": {
                  color: COLORS.error,
                },

                "& .MuiAlert-action": {
                  pt: 0.2,
                },
              }}
            >
              {apiErr}
            </Alert>
          </motion.div>
        )}

        {/* ====================================================
            FORM / LOADING
        ==================================================== */}

        <motion.div variants={itemVariants}>
          {loading ? (
            <Box>
              {[1, 2].map((item) => (
                <Box
                  key={item}
                  sx={{
                    position: "relative",

                    overflow: "hidden",

                    background:
                      COLORS.white,

                    border:
                      `1px solid ${COLORS.border}`,

                    borderRadius: {
                      xs: "15px",
                      sm: "17px",
                    },

                    p: {
                      xs: 1.75,
                      sm: 2.5,
                    },

                    mb: 1.5,

                    boxShadow:
                      "0 5px 20px rgba(41,91,105,0.045)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Skeleton
                      variant="rounded"
                      width={30}
                      height={30}
                      sx={{
                        borderRadius: 1.5,
                      }}
                    />

                    <Skeleton
                      width={130}
                      height={19}
                    />
                  </Stack>

                  <Stack spacing={1.25}>
                    <Skeleton
                      variant="rounded"
                      height={46}
                      sx={{
                        borderRadius: 1.5,
                      }}
                    />

                    <Skeleton
                      variant="rounded"
                      height={46}
                      sx={{
                        borderRadius: 1.5,
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Box>
          ) : (
            form && (
              <Box
                sx={{
                  position: "relative",

                  "& > *": {
                    transition:
                      "transform .25s ease",
                  },
                }}
              >
                <ProductForm
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                  isEdit={true}
                />
              </Box>
            )
          )}
        </motion.div>

        {/* ====================================================
            INVENTORY INFORMATION CARD
        ==================================================== */}

        {!loading && (
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                position: "relative",

                overflow: "hidden",

                mt: 1.5,

                px: {
                  xs: 1.5,
                  sm: 2,
                },

                py: {
                  xs: 1.25,
                  sm: 1.4,
                },

                borderRadius: "13px",

                background:
                  `linear-gradient(
                    135deg,
                    ${COLORS.aquaSoft},
                    ${COLORS.beigeSoft}
                  )`,

                border:
                  `1px solid ${COLORS.blueBorder}`,

                boxShadow:
                  "0 4px 16px rgba(79,157,184,0.055)",

                transition:
                  "all .25s ease",

                "&:hover": {
                  transform:
                    "translateY(-1px)",

                  boxShadow:
                    "0 7px 20px rgba(79,157,184,0.09)",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,

                    flexShrink: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "8px",

                    background:
                      COLORS.white,

                    border:
                      `1px solid ${COLORS.blueBorder}`,

                    color:
                      COLORS.primary,
                  }}
                >
                  <Inventory2RoundedIcon
                    sx={{
                      fontSize: 15,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ".72rem",

                      fontWeight: 800,

                      color: COLORS.ink,

                      mb: 0.15,
                    }}
                  >
                    Inventory managed separately
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: ".65rem",
                        sm: ".68rem",
                      },

                      color: COLORS.slate,

                      lineHeight: 1.45,
                    }}
                  >
                    Current stock, reorder level and
                    safety stock are managed from the
                    Inventory module.
                  </Typography>
                </Box>

                <AutoAwesomeRoundedIcon
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },

                    ml: "auto",

                    fontSize: 17,

                    color:
                      COLORS.primary,

                    opacity: 0.7,
                  }}
                />
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* ====================================================
            MOBILE STICKY ACTION BAR
        ==================================================== */}

        <Box
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },

            position: "fixed",

            left: 0,
            right: 0,

            bottom:
              "var(--navbar-height-mobile, 0px)",

            zIndex: 1200,

            px: 1,

            py: 0.9,

            background:
              "rgba(255,255,255,0.94)",

            backdropFilter:
              "blur(18px)",

            WebkitBackdropFilter:
              "blur(18px)",

            borderTop:
              `1px solid ${COLORS.border}`,

            boxShadow:
              "0 -8px 25px rgba(31,76,89,0.09)",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
          >
            <PrimaryButton
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate("/products")
              }
              disabled={saving}
              sx={{
                minHeight: 43,

                borderRadius: "10px",

                borderColor:
                  COLORS.border,

                color: COLORS.slate,

                background:
                  COLORS.white,

                fontSize: ".76rem",

                fontWeight: 700,

                textTransform: "none",

                "&:hover": {
                  borderColor:
                    COLORS.primary,

                  background:
                    COLORS.aquaSoft,
                },
              }}
            >
              Cancel
            </PrimaryButton>

            <PrimaryButton
              fullWidth
              variant="contained"
              disableElevation
              startIcon={
                saving ? (
                  <CircularProgress
                    size={14}
                    color="inherit"
                  />
                ) : (
                  <SaveOutlinedIcon
                    sx={{
                      fontSize: 16,
                    }}
                  />
                )
              }
              onClick={handleSubmit}
              disabled={saving || loading}
              sx={{
                minHeight: 43,

                borderRadius: "10px",

                fontSize: ".76rem",

                fontWeight: 750,

                textTransform: "none",

                color: COLORS.white,

                background:
                  `linear-gradient(
                    135deg,
                    ${COLORS.primary},
                    ${COLORS.primaryDark}
                  )`,

                boxShadow:
                  "0 5px 15px rgba(79,157,184,0.22)",

                "&:hover": {
                  background:
                    `linear-gradient(
                      135deg,
                      ${COLORS.primaryDark},
                      ${COLORS.primaryDeep}
                    )`,
                },
              }}
            >
              {saving
                ? "Saving…"
                : "Save changes"}
            </PrimaryButton>
          </Stack>
        </Box>
      </motion.div>

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
        sx={{
          bottom: {
            xs: 72,
            sm: 24,
          },
        }}
      >
        <Alert
          severity="success"
          icon={
            <CheckCircleRoundedIcon
              sx={{ fontSize: 19 }}
            />
          }
          sx={{
            minWidth: {
              xs: "auto",
              sm: 320,
            },

            borderRadius: "13px",

            background:
              COLORS.successSoft,

            border:
              "1px solid #CBEBDD",

            color:
              COLORS.success,

            fontSize: ".76rem",

            fontWeight: 700,

            boxShadow:
              "0 10px 30px rgba(46,155,115,0.14)",

            "& .MuiAlert-icon": {
              color:
                COLORS.success,
            },
          }}
        >
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
