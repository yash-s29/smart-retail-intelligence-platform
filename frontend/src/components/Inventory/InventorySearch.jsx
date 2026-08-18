// src/components/inventory/InventorySearch.jsx

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";

import { motion, AnimatePresence } from "framer-motion";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

/* ==========================================================
   Inventory Search
   ----------------------------------------------------------
   UI upgraded only.
   Search/debounce/API behavior remains unchanged.
========================================================== */

const InventorySearch = ({
  value = "",
  placeholder = "Search by Product, SKU or Supplier...",
  loading = false,
  onSearch,
}) => {
  // ==========================================================
  // Local State
  // ==========================================================

  const [searchValue, setSearchValue] = useState(value);

  // ==========================================================
  // Sync External Value
  // ==========================================================

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // ==========================================================
  // Debounced Search
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onSearch === "function") {
        onSearch(searchValue.trim());
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  // ==========================================================
  // Clear Search
  // ==========================================================

  const handleClear = () => {
    setSearchValue("");

    if (typeof onSearch === "function") {
      onSearch("");
    }
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        mb: { xs: 2, sm: 2.5 },

        position: "relative",
      }}
    >
      {/* ======================================================
          Decorative Background Glow
      ====================================================== */}

      <Box
        sx={{
          position: "absolute",
          top: 28,
          left: "8%",
          width: 110,
          height: 55,

          background:
            "radial-gradient(circle, rgba(125,211,220,.16), transparent 70%)",

          filter: "blur(12px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ======================================================
          Header
      ====================================================== */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 1.1, sm: 1.4 }}
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          {/* Animated Search Badge */}

          <motion.div
            animate={{
              y: [0, -2, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Box
              sx={{
                width: { xs: 30, sm: 32 },
                height: { xs: 30, sm: 32 },

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "10px",

                background:
                  "linear-gradient(135deg, rgba(126,211,220,.22), rgba(255,255,255,.96))",

                border:
                  "1px solid rgba(105,194,205,.28)",

                boxShadow:
                  "0 5px 14px rgba(70,170,185,.10)",

                color: "#287F8A",
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <SearchRoundedIcon
                  sx={{
                    fontSize: { xs: 16, sm: 17 },
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "0.95rem",
                },

                fontWeight: 800,

                color: "#173B45",

                letterSpacing: "-0.015em",

                lineHeight: 1.2,
              }}
            >
              Search Inventory
            </Typography>

            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },

                mt: 0.25,

                fontSize: "0.68rem",

                color: "#78939A",

                fontWeight: 500,
              }}
            >
              Find products quickly
            </Typography>
          </Box>
        </Stack>

        {/* Small status indicator */}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
            >
              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                sx={{
                  px: 1,
                  py: 0.45,

                  borderRadius: "999px",

                  background:
                    "rgba(125,211,220,.10)",

                  border:
                    "1px solid rgba(105,194,205,.16)",
                }}
              >
                <CircularProgress
                  size={11}
                  thickness={5}
                  sx={{
                    color: "#4DAAB6",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "#4C858E",
                  }}
                >
                  Searching
                </Typography>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#63B9A6",
                    boxShadow:
                      "0 0 0 4px rgba(99,185,166,.10)",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    color: "#78939A",
                    fontWeight: 600,
                  }}
                >
                  Ready
                </Typography>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>

      {/* ======================================================
          Search Container
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        whileHover={{
          y: -2,
        }}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: "relative",

            p: { xs: "3px", sm: "4px" },

            borderRadius: {
              xs: "14px",
              sm: "16px",
            },

            background:
              "linear-gradient(135deg, rgba(119,204,214,.26), rgba(246,241,230,.55), rgba(255,255,255,.92))",

            boxShadow:
              "0 8px 25px rgba(52,125,138,.07)",

            transition:
              "box-shadow .3s ease, transform .3s ease",

            "&:focus-within": {
              boxShadow:
                "0 12px 32px rgba(52,125,138,.13)",
            },
          }}
        >
          <TextField
            fullWidth
            size="small"
            disabled={loading}
            value={searchValue}
            placeholder={placeholder}
            onChange={(e) =>
              setSearchValue(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    ml: { xs: 0.5, sm: 0.8 },
                    mr: 0.5,
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.12,
                      rotate: -8,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 15,
                    }}
                  >
                    <Box
                      sx={{
                        width: {
                          xs: 32,
                          sm: 34,
                        },

                        height: {
                          xs: 32,
                          sm: 34,
                        },

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: "10px",

                        background:
                          "linear-gradient(135deg, #E7F8F9, #F7FBFB)",

                        color: "#328D99",

                        border:
                          "1px solid rgba(79,169,181,.14)",
                      }}
                    >
                      <SearchRoundedIcon
                        sx={{
                          fontSize: {
                            xs: 18,
                            sm: 19,
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    mr: { xs: 0.4, sm: 0.7 },
                  }}
                >
                  <AnimatePresence mode="wait">
                    {searchValue ? (
                      <motion.div
                        key="clear"
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                          rotate: -45,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.7,
                          rotate: 45,
                        }}
                      >
                        <Tooltip title="Clear search">
                          <IconButton
                            edge="end"
                            size="small"
                            disabled={loading}
                            onClick={handleClear}
                            sx={{
                              width: 34,
                              height: 34,

                              color: "#628087",

                              borderRadius: "10px",

                              transition:
                                "all .25s ease",

                              "&:hover": {
                                color: "#287F8A",
                                background:
                                  "#E8F7F8",
                                transform:
                                  "rotate(90deg) scale(1.05)",
                              },
                            }}
                          >
                            <ClearRoundedIcon
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="filter"
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: "10px",

                            color: "#8BA3A8",

                            background:
                              "rgba(247,241,229,.65)",
                          }}
                        >
                          <TuneRoundedIcon
                            sx={{
                              fontSize: 17,
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                minHeight: {
                  xs: 48,
                  sm: 52,
                },

                borderRadius: {
                  xs: "11px",
                  sm: "12px",
                },

                background:
                  "rgba(255,255,255,.96)",

                color: "#173B45",

                transition:
                  "all .3s cubic-bezier(.4,0,.2,1)",

                "& fieldset": {
                  borderColor:
                    "rgba(133,179,185,.22)",

                  borderWidth: "1px",

                  transition:
                    "all .3s ease",
                },

                "&:hover": {
                  background:
                    "rgba(255,255,255,1)",

                  "& fieldset": {
                    borderColor:
                      "rgba(77,170,182,.48)",
                  },
                },

                "&.Mui-focused": {
                  background: "#FFFFFF",

                  boxShadow:
                    "inset 0 0 0 1px rgba(77,170,182,.10)",

                  "& fieldset": {
                    borderColor: "#68B8C2",
                    borderWidth: 1.5,
                  },
                },

                "&.Mui-disabled": {
                  background:
                    "rgba(245,249,249,.8)",
                },
              },

              "& input": {
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.88rem",
                },

                fontWeight: 500,

                color: "#294B53",

                py: {
                  xs: 1.15,
                  sm: 1.3,
                },

                "&::placeholder": {
                  color: "#91A7AC",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      </motion.div>

      {/* ======================================================
          Search Hint
      ====================================================== */}

      <AnimatePresence>
        {!searchValue && !loading && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -4,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <Stack
              direction="row"
              spacing={0.7}
              alignItems="center"
              sx={{
                mt: 0.8,
                ml: { xs: 0.5, sm: 0.8 },
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#8CC8CE",
                }}
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "0.61rem",
                    sm: "0.64rem",
                  },

                  color: "#8AA1A6",

                  fontWeight: 500,
                }}
              >
                Search by product name, SKU or supplier
              </Typography>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

// ==========================================================
// PropTypes
// ==========================================================

InventorySearch.propTypes = {
  value: PropTypes.string,

  placeholder: PropTypes.string,

  loading: PropTypes.bool,

  onSearch: PropTypes.func,
};

// ==========================================================
// Default Props
// ==========================================================

InventorySearch.defaultProps = {
  value: "",

  placeholder:
    "Search by Product, SKU or Supplier...",

  loading: false,

  onSearch: () => {},
};

export default InventorySearch;
