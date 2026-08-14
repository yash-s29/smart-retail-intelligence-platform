import React from "react";
import { motion } from "framer-motion";

import {
  Avatar,
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
  PersonOutline,
  PhoneOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";

/* ============================================================
   Animation Variants
============================================================ */

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const avatarVariants = {
  hidden: {
    opacity: 0,
    scale: 0.82,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.08,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: -12,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.15,
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
        gap: 1,

        minWidth: 0,
        maxWidth: "100%",

        px: 1,
        py: 0.65,

        borderRadius: "9px",

        color: "text.secondary",

        transition:
          "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",

        "&:hover": {
          bgcolor: "action.hover",
          color: "text.primary",

          transform: {
            xs: "none",
            md: "translateY(-1px)",
          },
        },
      }}
    >
      {/* Icon container */}
      <Box
        sx={{
          width: 28,
          height: 28,

          flexShrink: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "8px",

          bgcolor: "action.hover",
          color: "primary.main",

          transition: "all 0.2s ease",
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 16,
          },
        })}
      </Box>

      {/* Contact text */}
      <Typography
        component="span"
        sx={{
          minWidth: 0,
          maxWidth: "100%",

          fontSize: {
            xs: "0.76rem",
            sm: "0.8rem",
            md: "0.83rem",
          },

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
     Safe fallbacks
  ---------------------------------------------------------- */

  const initials =
    user?.initials ||
    user?.name
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "?";

  const name = user?.name || "User";
  const role = user?.role || "Store Owner";
  const email = user?.email || "Email not provided";
  const phone = user?.phone || "Phone not provided";
  const location = user?.location || "Location not provided";

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

          bgcolor: "background.paper",

          boxShadow: "0 8px 28px rgba(15, 23, 42, 0.055)",

          transition:
            "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",

          /* ----------------------------------------------------
             Desktop hover
          ---------------------------------------------------- */

          "&:hover": {
            transform: {
              xs: "none",
              md: "translateY(-2px)",
            },

            boxShadow: "0 15px 40px rgba(15, 23, 42, 0.085)",

            borderColor: "rgba(99, 102, 241, 0.22)",
          },

          /* ----------------------------------------------------
             Background texture / atmosphere
          ---------------------------------------------------- */

          "&::before": {
            content: '""',

            position: "absolute",

            top: -170,
            right: -110,

            width: 380,
            height: 380,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(99,102,241,0.11) 0%, rgba(99,102,241,0.035) 38%, transparent 70%)",

            pointerEvents: "none",
          },

          "&::after": {
            content: '""',

            position: "absolute",

            bottom: -170,
            left: -110,

            width: 350,
            height: 350,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(16,185,129,0.065) 0%, rgba(16,185,129,0.02) 38%, transparent 70%)",

            pointerEvents: "none",
          },
        }}
      >
        {/* ======================================================
            Top Accent
        ====================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: 3,

            background:
              "linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",

            zIndex: 2,
          }}
        />

        <CardContent
          sx={{
            position: "relative",

            zIndex: 1,

            p: {
              xs: 2,
              sm: 2.75,
              md: 3,
              lg: 3.25,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                sm: 2.75,
                md: 3,
                lg: 3.25,
              },
            },
          }}
        >
          {/* ==================================================
              Main Layout

              Mobile:
              Avatar
              Information
              Button

              Tablet:
              Avatar | Information
                      Button

              Desktop:
              Avatar | Information | Button
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
                sm: 2.25,
                md: 2.75,
                lg: 3.5,
              },

              rowGap: {
                xs: 2,
                sm: 2.25,
                lg: 0,
              },
            }}
          >
            {/* ==================================================
                Avatar
            ================================================== */}

            <motion.div
              variants={avatarVariants}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",

                  width: {
                    xs: 76,
                    sm: 88,
                    md: 94,
                  },

                  height: {
                    xs: 76,
                    sm: 88,
                    md: 94,
                  },
                }}
              >
                {/* Animated glow */}

                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.07, 1],
                    opacity: [0.3, 0.48, 0.3],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: "absolute",

                    inset: -6,

                    borderRadius: "50%",

                    background:
                      "radial-gradient(circle, rgba(99,102,241,0.24), transparent 68%)",

                    pointerEvents: "none",
                  }}
                />

                {/* Avatar */}

                <Avatar
                  sx={{
                    position: "relative",

                    width: "100%",
                    height: "100%",

                    fontSize: {
                      xs: "1.65rem",
                      sm: "1.9rem",
                      md: "2.05rem",
                    },

                    fontWeight: 800,

                    color: "#fff",

                    background:
                      "linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)",

                    border: "4px solid",
                    borderColor: "background.paper",

                    boxShadow: "0 9px 25px rgba(79,70,229,0.25)",
                  }}
                >
                  {initials}
                </Avatar>

                {/* Online status */}

                <Box
                  component={motion.div}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34,197,94,0.35)",
                      "0 0 0 6px rgba(34,197,94,0)",
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  sx={{
                    position: "absolute",

                    right: {
                      xs: 0,
                      sm: 1,
                    },

                    bottom: {
                      xs: 0,
                      sm: 1,
                    },

                    width: {
                      xs: 16,
                      sm: 18,
                    },

                    height: {
                      xs: 16,
                      sm: 18,
                    },

                    borderRadius: "50%",

                    bgcolor: "#22c55e",

                    border: "3px solid",
                    borderColor: "background.paper",

                    zIndex: 3,
                  }}
                />
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
                spacing={1}
                sx={{
                  minWidth: 0,

                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                {/* Name */}

                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent: {
                      xs: "center",
                      sm: "flex-start",
                    },

                    gap: 0.6,

                    minWidth: 0,

                    maxWidth: "100%",
                  }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      minWidth: 0,

                      maxWidth: "100%",

                      fontSize: {
                        xs: "1.3rem",
                        sm: "1.5rem",
                        md: "1.65rem",
                      },

                      lineHeight: 1.2,

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

                  <VerifiedOutlined
                    sx={{
                      flexShrink: 0,

                      fontSize: {
                        xs: 17,
                        sm: 18,
                      },

                      color: "primary.main",
                    }}
                  />
                </Box>

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
                          fontSize: "15px !important",
                        }}
                      />
                    }
                    label={role}
                    size="small"
                    sx={{
                      height: 26,

                      borderRadius: "8px",

                      bgcolor: "rgba(99,102,241,0.08)",

                      color: "primary.main",

                      border: "1px solid rgba(99,102,241,0.14)",

                      fontSize: "0.74rem",

                      fontWeight: 700,

                      "& .MuiChip-icon": {
                        color: "primary.main",
                      },
                    }}
                  />
                </Box>

                {/* =================================================
                    Contact Details
                ================================================= */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 0.35,
                    sm: 0.5,
                    md: 0.75,
                  }}
                  sx={{
                    mt: 0.25,

                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },

                    minWidth: 0,

                    width: "100%",
                  }}
                >
                  <ContactItem icon={<EmailOutlined />}>
                    {email}
                  </ContactItem>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },

                      opacity: 0.45,
                    }}
                  />

                  <ContactItem icon={<PhoneOutlined />}>
                    {phone}
                  </ContactItem>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },

                      opacity: 0.45,
                    }}
                  />

                  <ContactItem icon={<LocationOnOutlined />}>
                    {location}
                  </ContactItem>
                </Stack>
              </Stack>
            </motion.div>

            {/* ==================================================
                Edit Button
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
                      sm: 140,
                      md: 150,
                    },

                    minHeight: {
                      xs: 43,
                      sm: 44,
                    },

                    px: {
                      xs: 2,
                      sm: 2.25,
                    },

                    borderRadius: "10px",

                    textTransform: "none",

                    fontSize: {
                      xs: "0.82rem",
                      sm: "0.84rem",
                    },

                    fontWeight: 700,

                    letterSpacing: "-0.01em",

                    color: "#fff",

                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",

                    boxShadow:
                      "0 7px 20px rgba(79,70,229,0.22)",

                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",

                      transform: {
                        xs: "none",
                        sm: "translateY(-2px)",
                      },

                      boxShadow:
                        "0 10px 25px rgba(79,70,229,0.3)",
                    },

                    "&:active": {
                      transform: "scale(0.98)",
                    },

                    "& .MuiButton-startIcon": {
                      transition: "transform 0.2s ease",
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
