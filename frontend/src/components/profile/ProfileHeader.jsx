import React from "react";
import { motion } from "framer-motion";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  EditOutlined,
  EmailOutlined,
  LocationOnOutlined,
  PersonOutlined,
  PhoneOutlined,
} from "@mui/icons-material";

/* ============================================================
   Animation Variants
============================================================ */

const containerVariants = {
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
    },
  },
};

const identityVariants = {
  hidden: {
    opacity: 0,
    x: -15,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.08,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.14,
      ease: "easeOut",
    },
  },
};

const actionVariants = {
  hidden: {
    opacity: 0,
    x: 12,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

/* ============================================================
   Contact Item
============================================================ */

const ContactItem = ({ icon, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.85,

        minWidth: 0,
        maxWidth: "100%",

        px: 0.8,
        py: 0.55,

        borderRadius: "9px",

        color: "text.secondary",

        transition:
          "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",

        "&:hover": {
          backgroundColor: "action.hover",
          color: "text.primary",

          transform: {
            xs: "none",
            md: "translateY(-1px)",
          },
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 27,
          height: 27,

          flexShrink: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "8px",

          backgroundColor: "action.hover",
          color: "primary.main",

          transition: "all 0.2s ease",

          "& svg": {
            fontSize: 16,
          },
        }}
      >
        {icon}
      </Box>

      {/* Text */}
      <Typography
        component="span"
        sx={{
          minWidth: 0,
          maxWidth: "100%",

          fontSize: {
            xs: "0.76rem",
            sm: "0.8rem",
            md: "0.82rem",
          },

          lineHeight: 1.4,

          fontWeight: 500,

          color: "inherit",

          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

/* ============================================================
   Profile Header
============================================================ */

export default function ProfileHeader({ user, onEditClick }) {
  /* ----------------------------------------------------------
     Safe User Data
  ---------------------------------------------------------- */

  const name = user?.name || "User";

  const role = user?.role || "Store Owner";

  const email = user?.email || "Email not provided";

  const phone = user?.phone || "Phone not provided";

  const location = user?.location || "Location not provided";

  /* ----------------------------------------------------------
     Generate initials without Avatar component
  ---------------------------------------------------------- */

  const initials =
    user?.initials ||
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "U";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: "100%",
      }}
    >
      <Card
        elevation={0}
        sx={{
          position: "relative",

          width: "100%",

          overflow: "hidden",

          borderRadius: {
            xs: "16px",
            sm: "18px",
            md: "20px",
          },

          border: "1px solid",
          borderColor: "divider",

          backgroundColor: "background.paper",

          boxShadow:
            "0 7px 25px rgba(15, 23, 42, 0.055)",

          transition:
            "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",

          "&:hover": {
            transform: {
              xs: "none",
              md: "translateY(-2px)",
            },

            boxShadow:
              "0 15px 38px rgba(15, 23, 42, 0.085)",

            borderColor:
              "rgba(99, 102, 241, 0.2)",
          },

          /* ==================================================
             Subtle Background Texture
          ================================================== */

          "&::before": {
            content: '""',

            position: "absolute",

            top: -150,
            right: -100,

            width: 350,
            height: 350,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.035) 40%, transparent 70%)",

            pointerEvents: "none",
          },

          "&::after": {
            content: '""',

            position: "absolute",

            bottom: -170,
            left: -120,

            width: 340,
            height: 340,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.025) 40%, transparent 70%)",

            pointerEvents: "none",
          },
        }}
      >
        {/* ==================================================
            Top Accent
        ================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: 3,

            background:
              "linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",

            zIndex: 3,
          }}
        />

        <CardContent
          sx={{
            position: "relative",

            zIndex: 2,

            p: {
              xs: 1.8,
              sm: 2.5,
              md: 3,
              lg: 3.25,
            },

            "&:last-child": {
              pb: {
                xs: 1.8,
                sm: 2.5,
                md: 3,
                lg: 3.25,
              },
            },
          }}
        >
          {/* ==================================================
              Main Layout
          ================================================== */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "auto minmax(0, 1fr)",
                lg: "auto minmax(0, 1fr) auto",
              },

              alignItems: "center",

              columnGap: {
                sm: 2,
                md: 2.75,
                lg: 3.5,
              },

              rowGap: {
                xs: 1.75,
                sm: 2,
                lg: 0,
              },
            }}
          >
            {/* ==================================================
                Identity / Initials
            ================================================== */}

            <motion.div variants={identityVariants}>
              <Box
                sx={{
                  display: "flex",

                  justifyContent: {
                    xs: "center",
                    sm: "flex-start",
                  },

                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",

                    width: {
                      xs: 68,
                      sm: 78,
                      md: 84,
                    },

                    height: {
                      xs: 68,
                      sm: 78,
                      md: 84,
                    },

                    display: "flex",

                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "18px",

                    background:
                      "linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)",

                    color: "#fff",

                    fontSize: {
                      xs: "1.45rem",
                      sm: "1.65rem",
                      md: "1.8rem",
                    },

                    fontWeight: 800,

                    letterSpacing: "-0.03em",

                    boxShadow:
                      "0 9px 24px rgba(79,70,229,0.24)",

                    border: "3px solid",

                    borderColor: "background.paper",

                    transition:
                      "transform 0.3s ease, box-shadow 0.3s ease",

                    "&:hover": {
                      transform: {
                        xs: "none",
                        md: "translateY(-3px) scale(1.02)",
                      },

                      boxShadow:
                        "0 14px 30px rgba(79,70,229,0.3)",
                    },

                    "&::before": {
                      content: '""',

                      position: "absolute",

                      inset: -5,

                      borderRadius: "21px",

                      border:
                        "1px solid rgba(99,102,241,0.16)",

                      pointerEvents: "none",
                    },
                  }}
                >
                  {initials}

                  {/* Active indicator */}

                  <Box
                    component={motion.div}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34,197,94,0.3)",
                        "0 0 0 5px rgba(34,197,94,0)",
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    sx={{
                      position: "absolute",

                      right: -2,
                      bottom: -2,

                      width: 15,
                      height: 15,

                      borderRadius: "50%",

                      backgroundColor: "#22c55e",

                      border: "3px solid",

                      borderColor:
                        "background.paper",

                      zIndex: 4,
                    }}
                  />
                </Box>
              </Box>
            </motion.div>

            {/* ==================================================
                User Information
            ================================================== */}

            <motion.div
              variants={contentVariants}
              style={{
                minWidth: 0,
                width: "100%",
              }}
            >
              <Stack
                spacing={0.85}
                sx={{
                  minWidth: 0,

                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                {/* Name */}

                <Typography
                  component="h1"
                  sx={{
                    minWidth: 0,

                    maxWidth: "100%",

                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.4rem",
                      md: "1.55rem",
                    },

                    lineHeight: 1.25,

                    fontWeight: 800,

                    letterSpacing: "-0.025em",

                    color: "text.primary",

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </Typography>

                {/* Role */}

                <Box
                  sx={{
                    display: "flex",

                    justifyContent: {
                      xs: "center",
                      sm: "flex-start",
                    },
                  }}
                >
                  <Chip
                    icon={
                      <PersonOutline
                        sx={{
                          fontSize:
                            "15px !important",
                        }}
                      />
                    }
                    label={role}
                    size="small"
                    sx={{
                      height: 25,

                      borderRadius: "8px",

                      backgroundColor:
                        "rgba(99,102,241,0.08)",

                      color: "primary.main",

                      border:
                        "1px solid rgba(99,102,241,0.14)",

                      fontSize: "0.73rem",

                      fontWeight: 700,

                      "& .MuiChip-icon": {
                        color: "primary.main",
                      },

                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </Box>

                {/* ==================================================
                    Contact Information
                ================================================== */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 0.25,
                    sm: 0.35,
                    md: 0.5,
                  }}
                  sx={{
                    mt: 0.2,

                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },

                    minWidth: 0,

                    width: "100%",
                  }}
                >
                  <ContactItem
                    icon={<EmailOutlined />}
                  >
                    {email}
                  </ContactItem>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },

                      opacity: 0.4,
                    }}
                  />

                  <ContactItem
                    icon={<PhoneOutlined />}
                  >
                    {phone}
                  </ContactItem>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },

                      opacity: 0.4,
                    }}
                  />

                  <ContactItem
                    icon={<LocationOnOutlined />}
                  >
                    {location}
                  </ContactItem>
                </Stack>
              </Stack>
            </motion.div>

            {/* ==================================================
                Edit Profile Action
            ================================================== */}

            <motion.div variants={actionVariants}>
              <Box
                sx={{
                  display: "flex",

                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-end",
                  },

                  width: "100%",

                  mt: {
                    xs: 0.5,
                    sm: 0,
                  },
                }}
              >
                <Button
                  onClick={onEditClick}
                  variant="contained"
                  startIcon={<EditOutlined />}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },

                    minWidth: {
                      sm: 135,
                      md: 145,
                    },

                    minHeight: {
                      xs: 42,
                      sm: 43,
                    },

                    px: {
                      xs: 2,
                      sm: 2.2,
                    },

                    borderRadius: "10px",

                    textTransform: "none",

                    fontSize: {
                      xs: "0.81rem",
                      sm: "0.83rem",
                    },

                    fontWeight: 700,

                    letterSpacing: "-0.01em",

                    color: "#fff",

                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",

                    boxShadow:
                      "0 6px 18px rgba(79,70,229,0.22)",

                    transition:
                      "transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",

                      transform: {
                        xs: "none",
                        sm: "translateY(-2px)",
                      },

                      boxShadow:
                        "0 10px 24px rgba(79,70,229,0.3)",
                    },

                    "&:active": {
                      transform: "scale(0.98)",
                    },

                    "& .MuiButton-startIcon": {
                      transition:
                        "transform 0.22s ease",
                    },

                    "&:hover .MuiButton-startIcon": {
                      transform: "rotate(-8deg)",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
