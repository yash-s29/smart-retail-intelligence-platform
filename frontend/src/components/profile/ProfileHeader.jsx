import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  useMediaQuery,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

/* ============================================================
   AVATAR SYSTEM
   ============================================================

   DiceBear Avataaars gives us much better control over:
   - hairstyles
   - facial hair
   - glasses
   - hats
   - clothing
   - mouth/expression
   - skin tone
   - hair color
   - background

   Each avatar is intentionally configured rather than relying
   only on random seeds.
   ============================================================ */

const DICEBEAR_BASE =
  "https://api.dicebear.com/9.x/avataaars/svg";

const avatarSrc = ({
  seed,
  background = "b6e3f4",
  skin = "variant01",
  hair = "short01",
  hairColor = "brown",
  eyes = "variant01",
  eyebrows = "variant01",
  mouth = "smile",
  glasses = null,
  facialHair = null,
  accessories = null,
  clothing = "shirtCrewNeck",
  clothingColor = "blue01",
}) => {
  const params = new URLSearchParams();

  params.set("seed", seed);
  params.set("backgroundColor", background);

  params.set("skinColor", skin);
  params.set("hairColor", hairColor);
  params.set("top", hair);
  params.set("eyes", eyes);
  params.set("eyebrows", eyebrows);
  params.set("mouth", mouth);

  params.set("clothing", clothing);
  params.set("clothingColor", clothingColor);

  if (glasses) {
    params.set("accessories", glasses);
    params.set("accessoriesProbability", "100");
  }

  if (facialHair) {
    params.set("facialHair", facialHair);
    params.set("facialHairProbability", "100");
  }

  if (accessories) {
    params.set("accessories", accessories);
    params.set("accessoriesProbability", "100");
  }

  return `${DICEBEAR_BASE}?${params.toString()}`;
};

/* ============================================================
   AVATAR OPTIONS
   ============================================================ */

const AVATAR_OPTIONS = [
  /* ---------------- MALE ---------------- */

  {
    id: "male-smile-1",
    name: "Aarav",
    gender: "Men",
    style: "Professional",
    expression: "Happy",
    icon: "🙂",
    src: avatarSrc({
      seed: "AaravProfessional",
      background: "b6e3f4",
      skin: "variant02",
      hair: "short01",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant01",
      mouth: "smile",
      clothing: "shirtCrewNeck",
      clothingColor: "blue01",
    }),
  },

  {
    id: "male-glasses-1",
    name: "Rohan",
    gender: "Men",
    style: "Smart",
    expression: "Happy",
    icon: "🤓",
    src: avatarSrc({
      seed: "RohanSmart",
      background: "c9e4de",
      skin: "variant01",
      hair: "short02",
      hairColor: "black",
      eyes: "variant02",
      eyebrows: "variant02",
      mouth: "smile",
      glasses: "prescription01",
      clothing: "shirtCrewNeck",
      clothingColor: "blue02",
    }),
  },

  {
    id: "male-beard-1",
    name: "Kabir",
    gender: "Men",
    style: "Bearded",
    expression: "Smile",
    icon: "🧔",
    src: avatarSrc({
      seed: "KabirBeard",
      background: "d1d4f9",
      skin: "variant03",
      hair: "short03",
      hairColor: "black",
      eyes: "variant01",
      eyebrows: "variant02",
      mouth: "smile",
      facialHair: "beardMedium",
      clothing: "shirtCrewNeck",
      clothingColor: "green01",
    }),
  },

  {
    id: "male-cap-1",
    name: "Vihaan",
    gender: "Men",
    style: "Casual",
    expression: "Happy",
    icon: "🧢",
    src: avatarSrc({
      seed: "VihaanCap",
      background: "ffd5dc",
      skin: "variant02",
      hair: "short05",
      hairColor: "brown",
      eyes: "variant02",
      eyebrows: "variant01",
      mouth: "smile",
      accessories: "prescription02",
      clothing: "shirtCrewNeck",
      clothingColor: "red01",
    }),
  },

  {
    id: "male-glasses-2",
    name: "Ishaan",
    gender: "Men",
    style: "Creative",
    expression: "Cheerful",
    icon: "😎",
    src: avatarSrc({
      seed: "IshaanCreative",
      background: "ffdfbf",
      skin: "variant04",
      hair: "short06",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant02",
      mouth: "smile",
      glasses: "sunglasses",
      clothing: "shirtCrewNeck",
      clothingColor: "purple01",
    }),
  },

  {
    id: "male-formal-1",
    name: "Dev",
    gender: "Men",
    style: "Executive",
    expression: "Friendly",
    icon: "👔",
    src: avatarSrc({
      seed: "DevExecutive",
      background: "c0aede",
      skin: "variant03",
      hair: "short07",
      hairColor: "black",
      eyes: "variant02",
      eyebrows: "variant01",
      mouth: "smile",
      facialHair: "beardLight",
      clothing: "blazerAndShirt",
      clothingColor: "blue02",
    }),
  },

  {
    id: "male-hat-1",
    name: "Aditya",
    gender: "Men",
    style: "Relaxed",
    expression: "Happy",
    icon: "🎩",
    src: avatarSrc({
      seed: "AdityaRelaxed",
      background: "c9e4de",
      skin: "variant02",
      hair: "short08",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant02",
      mouth: "smile",
      clothing: "shirtCrewNeck",
      clothingColor: "orange01",
    }),
  },

  /* ---------------- FEMALE ---------------- */

  {
    id: "female-smile-1",
    name: "Ananya",
    gender: "Women",
    style: "Professional",
    expression: "Happy",
    icon: "😊",
    src: avatarSrc({
      seed: "AnanyaProfessional",
      background: "ffd5dc",
      skin: "variant02",
      hair: "long01",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant01",
      mouth: "smile",
      clothing: "blazerAndShirt",
      clothingColor: "blue01",
    }),
  },

  {
    id: "female-glasses-1",
    name: "Priya",
    gender: "Women",
    style: "Smart",
    expression: "Happy",
    icon: "🤓",
    src: avatarSrc({
      seed: "PriyaSmart",
      background: "b6e3f4",
      skin: "variant03",
      hair: "long02",
      hairColor: "black",
      eyes: "variant02",
      eyebrows: "variant02",
      mouth: "smile",
      glasses: "prescription01",
      clothing: "shirtCrewNeck",
      clothingColor: "purple01",
    }),
  },

  {
    id: "female-happy-1",
    name: "Meera",
    gender: "Women",
    style: "Friendly",
    expression: "Cheerful",
    icon: "🥰",
    src: avatarSrc({
      seed: "MeeraFriendly",
      background: "c9e4de",
      skin: "variant01",
      hair: "long03",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant01",
      mouth: "smile",
      clothing: "shirtCrewNeck",
      clothingColor: "green01",
    }),
  },

  {
    id: "female-glasses-2",
    name: "Sara",
    gender: "Women",
    style: "Modern",
    expression: "Smile",
    icon: "👓",
    src: avatarSrc({
      seed: "SaraModern",
      background: "d1d4f9",
      skin: "variant04",
      hair: "long04",
      hairColor: "black",
      eyes: "variant02",
      eyebrows: "variant02",
      mouth: "smile",
      glasses: "prescription02",
      clothing: "shirtCrewNeck",
      clothingColor: "red01",
    }),
  },

  {
    id: "female-casual-1",
    name: "Zara",
    gender: "Women",
    style: "Casual",
    expression: "Happy",
    icon: "✨",
    src: avatarSrc({
      seed: "ZaraCasual",
      background: "ffdfbf",
      skin: "variant02",
      hair: "long05",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant01",
      mouth: "smile",
      clothing: "shirtCrewNeck",
      clothingColor: "orange01",
    }),
  },

  {
    id: "female-formal-1",
    name: "Aisha",
    gender: "Women",
    style: "Executive",
    expression: "Confident",
    icon: "💼",
    src: avatarSrc({
      seed: "AishaExecutive",
      background: "c0aede",
      skin: "variant03",
      hair: "long06",
      hairColor: "black",
      eyes: "variant02",
      eyebrows: "variant02",
      mouth: "smile",
      clothing: "blazerAndShirt",
      clothingColor: "blue02",
    }),
  },

  {
    id: "female-sunglasses-1",
    name: "Kiara",
    gender: "Women",
    style: "Trendy",
    expression: "Cool",
    icon: "😎",
    src: avatarSrc({
      seed: "KiaraTrendy",
      background: "b6e3f4",
      skin: "variant01",
      hair: "long07",
      hairColor: "brown",
      eyes: "variant01",
      eyebrows: "variant01",
      mouth: "smile",
      glasses: "sunglasses",
      clothing: "shirtCrewNeck",
      clothingColor: "purple01",
    }),
  },
];

/* ============================================================
   CONTACT ITEM
   ============================================================ */

function ContactItem({ icon: Icon, value }) {
  return (
    <Stack
      direction="row"
      spacing={0.6}
      alignItems="center"
      sx={{
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      <Icon
        sx={{
          fontSize: 15,
          color: COLORS.muted,
          flexShrink: 0,
        }}
      />

      <Typography
        noWrap
        sx={{
          fontSize: ".72rem",
          color: COLORS.slate,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: {
            xs: "190px",
            sm: "240px",
            md: "none",
          },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

/* ============================================================
   AVATAR PICKER
   ============================================================ */

function AvatarPicker({
  open,
  onClose,
  currentAvatar,
  onConfirm,
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentAvatar || AVATAR_OPTIONS[0].src
  );

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (open) {
      setSelectedAvatar(
        currentAvatar || AVATAR_OPTIONS[0].src
      );
      setFilter("All");
    }
  }, [open, currentAvatar]);

  const filteredAvatars = useMemo(() => {
    if (filter === "All") return AVATAR_OPTIONS;

    return AVATAR_OPTIONS.filter(
      (avatar) => avatar.gender === filter
    );
  }, [filter]);

  const handleConfirm = () => {
    onConfirm(selectedAvatar);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: {
            xs: "20px",
            sm: "26px",
          },
          overflow: "hidden",
          border: `1px solid ${COLORS.border}`,
          boxShadow:
            "0 30px 90px rgba(16,77,96,.22)",
          background: COLORS.white,
          mx: {
            xs: 1,
            sm: 2,
          },
          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 32px)",
          },
        },
      }}
    >
      {/* HEADER */}

      <DialogTitle
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pt: {
            xs: 2,
            sm: 2.5,
          },
          pb: 1.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "13px",
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(
                  135deg,
                  ${COLORS.primary}18,
                  ${COLORS.aquaPale}
                )`,
                border: `1px solid ${COLORS.primary}25`,
                color: COLORS.primary,
                flexShrink: 0,
              }}
            >
              <AutoAwesomeRoundedIcon
                sx={{ fontSize: 20 }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: ".98rem",
                    sm: "1.08rem",
                  },
                  fontWeight: 900,
                  color: COLORS.ink,
                  lineHeight: 1.2,
                }}
              >
                Choose your avatar
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: ".68rem",
                  color: COLORS.muted,
                  fontWeight: 600,
                }}
              >
                Pick a personality that represents you
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: COLORS.muted,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.white,
              flexShrink: 0,
              "&:hover": {
                background: COLORS.aquaPale,
                color: COLORS.primary,
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* FILTERS */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pt: 1.7,
          pb: 1,
          overflowX: "auto",
        }}
      >
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            minWidth: "max-content",
          }}
        >
          {[
            {
              label: "All",
              value: "All",
              icon: <FaceRoundedIcon />,
            },
            {
              label: "Men",
              value: "Men",
              icon: <MaleRoundedIcon />,
            },
            {
              label: "Women",
              value: "Women",
              icon: <FemaleRoundedIcon />,
            },
          ].map((item) => {
            const active = filter === item.value;

            return (
              <Chip
                key={item.value}
                icon={React.cloneElement(item.icon, {
                  sx: {
                    fontSize: 16,
                  },
                })}
                label={item.label}
                onClick={() => setFilter(item.value)}
                sx={{
                  height: 34,
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: ".68rem",
                  color: active
                    ? COLORS.white
                    : COLORS.slate,
                  background: active
                    ? `linear-gradient(
                        135deg,
                        ${COLORS.primary},
                        ${COLORS.primaryDark}
                      )`
                    : "#f5fafc",
                  border: active
                    ? "none"
                    : `1px solid ${COLORS.border}`,
                  "& .MuiChip-icon": {
                    color: active
                      ? COLORS.white
                      : COLORS.primary,
                  },
                  "&:hover": {
                    background: active
                      ? `linear-gradient(
                          135deg,
                          ${COLORS.primaryDark},
                          ${COLORS.primaryDeep}
                        )`
                      : COLORS.aquaPale,
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* AVATARS */}

      <DialogContent
        sx={{
          px: {
            xs: 1.7,
            sm: 3,
          },
          pb: 2,
          maxHeight: {
            xs: "58vh",
            sm: "60vh",
            md: "62vh",
          },
          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            background: `${COLORS.primary}35`,
            borderRadius: 10,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
            },
            gap: {
              xs: 1,
              sm: 1.4,
              md: 1.6,
            },
            mt: 0.8,
          }}
        >
          {filteredAvatars.map((avatar) => {
            const isSelected =
              selectedAvatar === avatar.src;

            return (
              <motion.button
                key={avatar.id}
                type="button"
                whileHover={{
                  y: -4,
                  scale: 1.025,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.16,
                }}
                onClick={() =>
                  setSelectedAvatar(avatar.src)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "0.86 / 1",
                    borderRadius: {
                      xs: "14px",
                      sm: "17px",
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isSelected
                      ? `linear-gradient(
                          145deg,
                          ${COLORS.aquaPale},
                          ${COLORS.primary}13
                        )`
                      : "#f8fbfc",
                    border: isSelected
                      ? `2px solid ${COLORS.primary}`
                      : `1px solid ${COLORS.border}`,
                    boxShadow: isSelected
                      ? "0 10px 28px rgba(16,121,159,.18)"
                      : "0 4px 14px rgba(16,77,96,.05)",
                    transition:
                      "all .2s ease",
                    overflow: "hidden",
                  }}
                >
                  {/* AVATAR */}

                  <motion.div
                    animate={
                      isSelected
                        ? {
                            y: [0, -2, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Avatar
                      src={avatar.src}
                      alt={`${avatar.name} avatar`}
                      imgProps={{
                        loading: "lazy",
                      }}
                      sx={{
                        width: {
                          xs: 58,
                          sm: 72,
                          md: 82,
                        },
                        height: {
                          xs: 58,
                          sm: 72,
                          md: 82,
                        },
                        border: "3px solid white",
                        boxShadow:
                          "0 7px 20px rgba(16,77,96,.13)",
                        background:
                          COLORS.aquaPale,
                      }}
                    />
                  </motion.div>

                  {/* SELECTED */}

                  {isSelected && (
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 23,
                          height: 23,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          background:
                            COLORS.primary,
                          color:
                            COLORS.white,
                          border:
                            "2px solid white",
                          boxShadow:
                            "0 4px 10px rgba(16,121,159,.25)",
                        }}
                      >
                        <CheckRoundedIcon
                          sx={{
                            fontSize: 13,
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}

                  {/* NAME */}

                  <Typography
                    sx={{
                      mt: 0.7,
                      fontSize: {
                        xs: ".58rem",
                        sm: ".62rem",
                      },
                      fontWeight: 850,
                      color: isSelected
                        ? COLORS.primary
                        : COLORS.slate,
                      lineHeight: 1.1,
                    }}
                  >
                    {avatar.name}
                  </Typography>

                  {/* STYLE */}

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: {
                        xs: ".49rem",
                        sm: ".53rem",
                      },
                      color: COLORS.muted,
                      fontWeight: 600,
                    }}
                  >
                    {avatar.style}
                  </Typography>
                </Box>
              </motion.button>
            );
          })}
        </Box>

        {/* EMPTY */}

        {filteredAvatars.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <SentimentSatisfiedAltRoundedIcon
              sx={{
                fontSize: 42,
                color: COLORS.muted,
              }}
            />

            <Typography
              sx={{
                mt: 1,
                fontWeight: 800,
                color: COLORS.slate,
              }}
            >
              No avatars found
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* ACTIONS */}

      <DialogActions
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          py: {
            xs: 1.5,
            sm: 2,
          },
          borderTop: `1px solid ${COLORS.border}`,
          background: "#fbfdfe",
          gap: 1,
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
          alignItems: "stretch",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            minHeight: 40,
            px: 2.2,
            borderRadius: "11px",
            color: COLORS.slate,
            textTransform: "none",
            fontWeight: 750,
            fontSize: ".72rem",
            width: {
              xs: "100%",
              sm: "auto",
            },
            "&:hover": {
              background: COLORS.aquaPale,
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          disableElevation
          startIcon={
            <CheckRoundedIcon
              sx={{ fontSize: 17 }}
            />
          }
          sx={{
            minHeight: 40,
            px: 2.3,
            borderRadius: "11px",
            background: `linear-gradient(
              135deg,
              ${COLORS.primary},
              ${COLORS.primaryDark}
            )`,
            color: COLORS.white,
            textTransform: "none",
            fontWeight: 800,
            fontSize: ".72rem",
            boxShadow:
              "0 7px 18px rgba(16,121,159,.18)",
            width: {
              xs: "100%",
              sm: "auto",
            },
            "&:hover": {
              background: `linear-gradient(
                135deg,
                ${COLORS.primaryDark},
                ${COLORS.primaryDeep}
              )`,
              boxShadow:
                "0 9px 22px rgba(16,121,159,.25)",
            },
          }}
        >
          Use this avatar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================================================
   PROFILE HEADER
   ============================================================ */

export default function ProfileHeader({
  user,
  onEditClick,
  onAvatarChange,
}) {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  const [avatarPickerOpen, setAvatarPickerOpen] =
    useState(false);

  const avatarUrl = user?.avatarUrl || null;

  return (
    <>
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
        }}
      >
        <Card
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: RADIUS,
            border: `1px solid ${COLORS.border}`,

            background: `linear-gradient(
              135deg,
              ${COLORS.white} 0%,
              ${COLORS.aquaPale} 100%
            )`,

            boxShadow:
              "0 4px 18px rgba(16,77,96,.06)",

            transition:
              "box-shadow .25s ease, transform .25s ease",

            "&:hover": {
              boxShadow:
                "0 15px 36px rgba(16,77,96,.10)",
            },

            ...reduceMotion,
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.5,
                sm: 2.3,
                md: 2.7,
              },

              "&:last-child": {
                pb: {
                  xs: 1.5,
                  sm: 2.3,
                  md: 2.7,
                },
              },
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={{
                xs: 1.5,
                sm: 2.2,
              }}
              alignItems={{
                xs: "center",
                sm: "center",
              }}
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              {/* =====================================================
                  AVATAR
                  ===================================================== */}

              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: {
                    xs: 92,
                    sm: 104,
                  },
                  height: {
                    xs: 92,
                    sm: 104,
                  },
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {/* SOFT GLOW */}

                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [
                            1,
                            1.07,
                            1,
                          ],
                          opacity: [
                            0.4,
                            0.7,
                            0.4,
                          ],
                        }
                  }
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: `radial-gradient(
                      circle,
                      ${COLORS.aqua}35,
                      transparent 68%
                    )`,
                    pointerEvents: "none",
                  }}
                />

                {/* ORBIT */}

                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          rotate: 360,
                        }
                  }
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: 2,
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 3,
                      left: "50%",
                      transform:
                        "translateX(-50%)",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        COLORS.primary,
                      opacity: 0.7,
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 7,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background:
                        COLORS.aqua,
                      opacity: 0.8,
                    }}
                  />
                </motion.div>

                {/* AVATAR BUTTON */}

                <motion.button
                  type="button"
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.045,
                        }
                  }
                  whileTap={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 0.96,
                        }
                  }
                  onClick={() =>
                    setAvatarPickerOpen(true)
                  }
                  aria-label="Change profile avatar"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    border: "none",
                    padding: 0,
                    background:
                      "transparent",
                    cursor: "pointer",
                    borderRadius: "50%",
                    outline: "none",
                  }}
                >
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: [
                              0,
                              -1.5,
                              0,
                            ],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Avatar
                      src={
                        avatarUrl ||
                        undefined
                      }
                      alt={
                        user?.name ||
                        "Profile avatar"
                      }
                      sx={{
                        width: {
                          xs: 76,
                          sm: 86,
                        },
                        height: {
                          xs: 76,
                          sm: 86,
                        },

                        background: `linear-gradient(
                          135deg,
                          ${COLORS.primary},
                          ${COLORS.primaryDark}
                        )`,

                        fontSize: {
                          xs: "1.55rem",
                          sm: "1.8rem",
                        },

                        fontWeight: 900,
                        color:
                          COLORS.white,

                        border:
                          "4px solid white",

                        boxShadow:
                          "0 9px 26px rgba(16,121,159,.25)",
                      }}
                    >
                      {!avatarUrl &&
                        user?.initials}
                    </Avatar>
                  </motion.div>

                  {/* CAMERA */}

                  <Box
                    sx={{
                      position:
                        "absolute",
                      right: {
                        xs: -1,
                        sm: 0,
                      },
                      bottom: {
                        xs: -1,
                        sm: 0,
                      },
                      width: {
                        xs: 27,
                        sm: 29,
                      },
                      height: {
                        xs: 27,
                        sm: 29,
                      },
                      borderRadius:
                        "50%",
                      display: "grid",
                      placeItems:
                        "center",
                      background:
                        COLORS.white,
                      color:
                        COLORS.primary,
                      border: `1px solid ${COLORS.border}`,
                      boxShadow:
                        "0 5px 13px rgba(16,77,96,.15)",
                    }}
                  >
                    <CameraAltRoundedIcon
                      sx={{
                        fontSize: {
                          xs: 13,
                          sm: 15,
                        },
                      }}
                    />
                  </Box>
                </motion.button>

                {/* ONLINE STATUS */}

                <Box
                  sx={{
                    position:
                      "absolute",
                    zIndex: 4,
                    bottom: {
                      xs: 7,
                      sm: 9,
                    },
                    right: {
                      xs: 7,
                      sm: 10,
                    },
                    width: 14,
                    height: 14,
                    bgcolor:
                      COLORS.success,
                    borderRadius:
                      "50%",
                    border:
                      "2.5px solid white",
                    boxShadow:
                      "0 2px 8px rgba(63,145,93,.25)",
                    pointerEvents:
                      "none",
                  }}
                />
              </Box>

              {/* =====================================================
                  IDENTITY
                  ===================================================== */}

              <Box
                flex={1}
                minWidth={0}
                width="100%"
                textAlign={{
                  xs: "center",
                  sm: "left",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: "1.12rem",
                      sm: "1.3rem",
                      md: "1.35rem",
                    },
                    color: COLORS.ink,
                    letterSpacing:
                      "-.02em",
                    lineHeight: 1.2,
                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {user?.name ||
                    "User"}
                </Typography>

                <Typography
                  sx={{
                    color:
                      COLORS.primary,
                    fontWeight: 750,
                    fontSize: ".73rem",
                    mt: 0.2,
                  }}
                >
                  {user?.role ||
                    "Store Owner"}
                </Typography>

                {/* CONTACT DETAILS */}

                <Stack
                  direction="row"
                  spacing={1.5}
                  flexWrap="wrap"
                  justifyContent={{
                    xs: "center",
                    sm: "flex-start",
                  }}
                  sx={{
                    mt: 0.9,
                    rowGap: 0.6,
                    columnGap: {
                      xs: 1.1,
                      sm: 1.7,
                    },
                    width: "100%",
                  }}
                >
                  {user?.email && (
                    <ContactItem
                      icon={
                        EmailRoundedIcon
                      }
                      value={
                        user.email
                      }
                    />
                  )}

                  <ContactItem
                    icon={
                      PhoneRoundedIcon
                    }
                    value={
                      user?.phone ||
                      "Not provided"
                    }
                  />

                  <ContactItem
                    icon={
                      PlaceRoundedIcon
                    }
                    value={
                      user?.location ||
                      "Location not set"
                    }
                  />
                </Stack>
              </Box>

              {/* =====================================================
                  EDIT BUTTON
                  ===================================================== */}

              <Button
                onClick={
                  onEditClick
                }
                variant="contained"
                startIcon={
                  <EditRoundedIcon
                    sx={{
                      fontSize: 16,
                    }}
                  />
                }
                disableElevation
                sx={{
                  flexShrink: 0,
                  minHeight: 40,
                  px: 2,
                  borderRadius: "11px",

                  background: `linear-gradient(
                    135deg,
                    ${COLORS.primary},
                    ${COLORS.primaryDark}
                  )`,

                  color: COLORS.white,
                  textTransform:
                    "none",
                  fontWeight: 800,
                  fontSize: ".73rem",

                  boxShadow:
                    "0 6px 16px rgba(16,121,159,.2)",

                  width: {
                    xs: "100%",
                    sm: "auto",
                  },

                  "&:hover": {
                    background: `linear-gradient(
                      135deg,
                      ${COLORS.primaryDark},
                      ${COLORS.primaryDeep}
                    )`,
                    boxShadow:
                      "0 9px 22px rgba(16,121,159,.28)",
                    transform:
                      "translateY(-1px)",
                  },

                  transition:
                    "all .2s ease",
                }}
              >
                Edit profile
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================================
          AVATAR DIALOG
          ============================================================ */}

      <AvatarPicker
        open={avatarPickerOpen}
        onClose={() =>
          setAvatarPickerOpen(false)
        }
        currentAvatar={avatarUrl}
        onConfirm={
          onAvatarChange
        }
      />
    </>
  );
}
