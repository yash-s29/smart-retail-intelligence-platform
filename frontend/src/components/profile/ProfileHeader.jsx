import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  EditOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  VerifiedOutlined,
  PersonOutline,
} from "@mui/icons-material";

/* ============================================================
   Animation presets
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
   Contact item
============================================================ */

const ContactItem = ({ icon, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,

        minWidth: 0,

        px: 1.25,
        py: 0.75,

        borderRadius: "10px",

        color: "text.secondary",

        transition:
          "background-color .22s ease, color .22s ease, transform .22s ease",

        "&:hover": {
          bgcolor: "action.hover",
          color: "text.primary",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          width: 28,
          height: 28,

          flexShrink: 0,

          borderRadius: "8px",

          bgcolor: "action.hover",

          color: "primary.main",

          transition: "all .22s ease",
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 16,
          },
        })}
      </Box>

      <Typography
        sx={{
          minWidth: 0,

          fontSize: {
            xs: "0.78rem",
            sm: "0.82rem",
            md: "0.85rem",
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
  const initials = user?.initials || "?";
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
            xs: "18px",
            sm: "20px",
            md: "22px",
          },

          border: "1px solid",
          borderColor: "divider",

          backgroundColor: "background.paper",

          boxShadow:
            "0 8px 30px rgba(15, 23, 42, 0.055)",

          transition:
            "transform .3s ease, box-shadow .3s ease, border-color .3s ease",

          "&:hover": {
            transform: {
              xs: "none",
              md: "translateY(-2px)",
            },

            boxShadow:
              "0 16px 42px rgba(15, 23, 42, 0.09)",

            borderColor: "rgba(99, 102, 241, 0.22)",
          },

          /* =====================================================
             Subtle background texture / atmosphere
          ===================================================== */

          "&::before": {
            content: '""',

            position: "absolute",

            top: -150,
            right: -100,

            width: 360,
            height: 360,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 35%, transparent 70%)",

            pointerEvents: "none",
          },

          "&::after": {
            content: '""',

            position: "absolute",

            bottom: -160,
            left: -100,

            width: 320,
            height: 320,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.025) 35%, transparent 70%)",

            pointerEvents: "none",
          },
        }}
      >
        {/* =====================================================
            Top accent line
        ===================================================== */}

        <Box
          sx={{
            position: "absolute",

            top: 0,
            left: 0,
            right: 0,

            height: 3,

            background:
              "linear-gradient(90deg, #4f46e5 0%, #6366f1 45%, #8b5cf6 100%)",

            zIndex: 2,
          }}
        />

        <CardContent
          sx={{
            position: "relative",

            zIndex: 1,

            p: {
              xs: 2.25,
              sm: 3,
              md: 3.5,
              lg: 4,
            },

            "&:last-child": {
              pb: {
                xs: 2.25,
                sm: 3,
                md: 3.5,
                lg: 4,
              },
            },
          }}
        >
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
                sm: 2.5,
                md: 3,
                lg: 4,
              },

              rowGap: 2.5,
            }}
          >
            {/* =================================================
                Avatar
            ================================================= */}

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
                    xs: 82,
                    sm: 92,
                    md: 100,
                  },

                  height: {
                    xs: 82,
                    sm: 92,
                    md: 100,
                  },
                }}
              >
                {/* Soft animated glow */}

                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.35, 0.55, 0.35],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: "absolute",

                    inset: -6,

                    borderRadius: "50%",

                    background:
                      "radial-gradient(circle, rgba(99,102,241,0.25), transparent 68%)",
                  }}
                />

                <Avatar
                  sx={{
                    position: "relative",

                    width: "100%",
                    height: "100%",

                    fontSize: {
                      xs: "1.8rem",
                      sm: "2rem",
                      md: "2.2rem",
                    },

                    fontWeight: 800,

                    color: "#fff",

                    background:
                      "linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)",

                    border: "4px solid",

                    borderColor: "background.paper",

                    boxShadow:
                      "0 10px 28px rgba(79,70,229,0.28)",
                  }}
                >
                  {initials}
                </Avatar>

                {/* Online indicator */}

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
                      xs: 1,
                      sm: 2,
                    },

                    bottom: {
                      xs: 1,
                      sm: 2,
                    },

                    width: {
                      xs: 17,
                      sm: 19,
                    },

                    height: {
                      xs: 17,
                      sm: 19,
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

            {/* =================================================
                User information
            ================================================= */}

            <motion.div variants={contentVariants}>
              <Stack
                spacing={{
                  xs: 1.1,
                  sm: 1.2,
                }}
                sx={{
                  minWidth: 0,

                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                {/* Name + verified */}

                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent: {
                      xs: "center",
                      sm: "flex-start",
                    },

                    gap: 0.75,

                    minWidth: 0,
                  }}
                >
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: {
                        xs: "1.35rem",
                        sm: "1.6rem",
                        md: "1.75rem",
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
                        xs: 18,
                        sm: 19,
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
                          fontSize: "16px !important",
                        }}
                      />
                    }
                    label={role}
                    size="small"
                    sx={{
                      height: 27,

                      borderRadius: "8px",

                      bgcolor:
                        "rgba(99,102,241,0.09)",

                      color: "primary.main",

                      border:
                        "1px solid rgba(99,102,241,0.14)",

                      fontSize: "0.76rem",

                      fontWeight: 700,

                      "& .MuiChip-icon": {
                        color: "primary.main",
                      },
                    }}
                  />
                </Box>

                {/* =================================================
                    Contact information
                ================================================= */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 0.5,
                    sm: 0.75,
                    md: 1,
                  }}
                  divider={
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        display: {
                          xs: "none",
                          md: "block",
                        },

                        opacity: 0.5,
                      }}
                    />
                  }
                  sx={{
                    mt: 0.5,

                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },

                    maxWidth: "100%",
                  }}
                >
                  <ContactItem icon={<EmailOutlined />}>
                    {email}
                  </ContactItem>

                  <ContactItem icon={<PhoneOutlined />}>
                    {phone}
                  </ContactItem>

                  <ContactItem icon={<LocationOnOutlined />}>
                    {location}
                  </ContactItem>
                </Stack>
              </Stack>
            </motion.div>

            {/* =================================================
                Action
            ================================================= */}

            <motion.div variants={actionVariants}>
              <Box
                sx={{
                  display: "flex",

                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-start",
                    lg: "flex-end",
                  },

                  width: {
                    xs: "100%",
                    lg: "auto",
                  },
                }}
              >
                <Button
                  fullWidth
                  onClick={onEditClick}
                  variant="contained"
                  startIcon={<EditOutlined />}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },

                    minWidth: {
                      sm: 145,
                      md: 155,
                    },

                    minHeight: {
                      xs: 44,
                      sm: 46,
                    },

                    px: {
                      xs: 2,
                      sm: 2.5,
                    },

                    borderRadius: "11px",

                    textTransform: "none",

                    fontSize: "0.86rem",

                    fontWeight: 700,

                    letterSpacing: "-0.01em",

                    color: "#fff",

                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",

                    boxShadow:
                      "0 7px 20px rgba(79,70,229,0.24)",

                    transition:
                      "transform .22s ease, box-shadow .22s ease, background .22s ease",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",

                      transform: {
                        xs: "none",
                        sm: "translateY(-2px)",
                      },

                      boxShadow:
                        "0 11px 26px rgba(79,70,229,0.32)",
                    },

                    "&:active": {
                      transform: "scale(0.98)",
                    },

                    "& .MuiButton-startIcon": {
                      transition: "transform .22s ease",
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
