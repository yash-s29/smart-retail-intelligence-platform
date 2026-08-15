import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { COLORS, RADIUS, fadeUp, reduceMotion } from "./shared";

/* ============================================================
   DICEBEAR AVATAR ENGINE
   ============================================================

   IMPORTANT:
   Current DiceBear Avataaars API uses:

   topVariant
   eyesVariant
   eyebrowsVariant
   mouthVariant
   clothesVariant
   accessoriesVariant
   facialHairVariant

   NOT the old:
   top
   eyes
   mouth
   clothing
   accessories
   etc.

   ============================================================ */

const DICEBEAR_BASE =
  "https://api.dicebear.com/10.x/avataaars/svg";

/* ============================================================
   COLOR PALETTE
   ============================================================ */

const SKIN = {
  light: "ffdbb4",
  fair: "edb98a",
  warm: "d08b5b",
  brown: "ae5d29",
  deep: "614335",
};

const HAIR = {
  black: "2c1b18",
  darkBrown: "724133",
  brown: "a55728",
  golden: "b58143",
  lightBrown: "d6b370",
};

/* ============================================================
   AVATAR URL BUILDER
   ============================================================ */

function avatarSrc({
  seed,
  background = "eef8fb",
  skinColor = SKIN.fair,
  hairColor = HAIR.darkBrown,

  topVariant = "shortRound",

  eyesVariant = "happy",
  eyebrowsVariant = "default",
  mouthVariant = "smile",

  accessoriesVariant = null,
  facialHairVariant = null,

  clothesVariant = "shirtCrewNeck",
  clothesColor = "5199e4",

  hatColor = "262e33",
}) {
  const params = new URLSearchParams();

  params.set("seed", seed);

  /* background */
  params.set("backgroundColor", background);

  /* face */
  params.set("skinColor", skinColor);
  params.set("eyesVariant", eyesVariant);
  params.set("eyebrowsVariant", eyebrowsVariant);
  params.set("mouthVariant", mouthVariant);

  /* hair */
  params.set("topVariant", topVariant);
  params.set("hairColor", hairColor);

  /* clothes */
  params.set("clothesVariant", clothesVariant);
  params.set("clothesColor", clothesColor);

  /* accessories */
  if (accessoriesVariant) {
    params.set("accessoriesVariant", accessoriesVariant);
    params.set("accessoriesProbability", "100");
  } else {
    params.set("accessoriesProbability", "0");
  }

  /* facial hair */
  if (facialHairVariant) {
    params.set("facialHairVariant", facialHairVariant);
    params.set("facialHairProbability", "100");
  } else {
    params.set("facialHairProbability", "0");
  }

  /* hat color */
  params.set("hatColor", hatColor);

  return `${DICEBEAR_BASE}?${params.toString()}`;
}

/* ============================================================
   AVATAR OPTIONS
   ============================================================ */

const AVATAR_OPTIONS = [
  /* ==========================================================
     MEN
     ========================================================== */

  {
    id: "aarav",
    name: "Aarav",
    gender: "Men",
    style: "Professional",
    expression: "Happy",
    icon: "😊",

    src: avatarSrc({
      seed: "AaravProfessional2026",
      background: "eaf7fb",
      skinColor: SKIN.fair,
      hairColor: HAIR.darkBrown,
      topVariant: "shortRound",
      eyesVariant: "happy",
      eyebrowsVariant: "default",
      mouthVariant: "smile",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "5199e4",
    }),
  },

  {
    id: "rohan",
    name: "Rohan",
    gender: "Men",
    style: "Smart",
    expression: "Cheerful",
    icon: "🤓",

    src: avatarSrc({
      seed: "RohanSmart2026",
      background: "e8f5f3",
      skinColor: SKIN.warm,
      hairColor: HAIR.black,
      topVariant: "shortWaved",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      accessoriesVariant: "prescription01",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "65c9ff",
    }),
  },

  {
    id: "kabir",
    name: "Kabir",
    gender: "Men",
    style: "Bearded",
    expression: "Friendly",
    icon: "🧔",

    src: avatarSrc({
      seed: "KabirBearded2026",
      background: "edf0ff",
      skinColor: SKIN.brown,
      hairColor: HAIR.black,
      topVariant: "shortFlat",
      eyesVariant: "happy",
      eyebrowsVariant: "defaultNatural",
      mouthVariant: "smile",
      facialHairVariant: "beardMedium",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "65c9ff",
    }),
  },

  {
    id: "vihaan",
    name: "Vihaan",
    gender: "Men",
    style: "Casual",
    expression: "Happy",
    icon: "🧢",

    src: avatarSrc({
      seed: "VihaanCasual2026",
      background: "fff0f3",
      skinColor: SKIN.fair,
      hairColor: HAIR.brown,
      topVariant: "hat",
      eyesVariant: "happy",
      eyebrowsVariant: "default",
      mouthVariant: "smile",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "ff5c5c",
      hatColor: "5199e4",
    }),
  },

  {
    id: "ishaan",
    name: "Ishaan",
    gender: "Men",
    style: "Cool",
    expression: "Confident",
    icon: "😎",

    src: avatarSrc({
      seed: "IshaanCool2026",
      background: "fff3e7",
      skinColor: SKIN.warm,
      hairColor: HAIR.brown,
      topVariant: "shortCurly",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      accessoriesVariant: "sunglasses",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "a7ffc4",
    }),
  },

  {
    id: "dev",
    name: "Dev",
    gender: "Men",
    style: "Executive",
    expression: "Confident",
    icon: "💼",

    src: avatarSrc({
      seed: "DevExecutive2026",
      background: "eef0ff",
      skinColor: SKIN.brown,
      hairColor: HAIR.black,
      topVariant: "theCaesarAndSidePart",
      eyesVariant: "happy",
      eyebrowsVariant: "defaultNatural",
      mouthVariant: "smile",
      facialHairVariant: "beardLight",
      clothesVariant: "blazerAndShirt",
      clothesColor: "5199e4",
    }),
  },

  {
    id: "aditya",
    name: "Aditya",
    gender: "Men",
    style: "Relaxed",
    expression: "Happy",
    icon: "🎩",

    src: avatarSrc({
      seed: "AdityaRelaxed2026",
      background: "e8f7f4",
      skinColor: SKIN.fair,
      hairColor: HAIR.brown,
      topVariant: "winterHat03",
      eyesVariant: "happy",
      eyebrowsVariant: "default",
      mouthVariant: "smile",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "ffb259",
      hatColor: "5199e4",
    }),
  },

  {
    id: "arjun",
    name: "Arjun",
    gender: "Men",
    style: "Modern",
    expression: "Smile",
    icon: "✨",

    src: avatarSrc({
      seed: "ArjunModern2026",
      background: "edf8ff",
      skinColor: SKIN.warm,
      hairColor: HAIR.darkBrown,
      topVariant: "shaggy",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      accessoriesVariant: "wayfarers",
      clothesVariant: "hoodie",
      clothesColor: "5199e4",
    }),
  },

  {
    id: "vivaan",
    name: "Vivaan",
    gender: "Men",
    style: "Creative",
    expression: "Cheerful",
    icon: "🎨",

    src: avatarSrc({
      seed: "VivaanCreative2026",
      background: "fff5ef",
      skinColor: SKIN.fair,
      hairColor: HAIR.black,
      topVariant: "curly",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      clothesVariant: "graphicShirt",
      clothesColor: "ff5c5c",
    }),
  },

  /* ==========================================================
     WOMEN
     ========================================================== */

  {
    id: "ananya",
    name: "Ananya",
    gender: "Women",
    style: "Professional",
    expression: "Happy",
    icon: "😊",

    src: avatarSrc({
      seed: "AnanyaProfessional2026",
      background: "fff0f4",
      skinColor: SKIN.fair,
      hairColor: HAIR.brown,
      topVariant: "longButNotTooLong",
      eyesVariant: "happy",
      eyebrowsVariant: "default",
      mouthVariant: "smile",
      clothesVariant: "blazerAndShirt",
      clothesColor: "5199e4",
    }),
  },

  {
    id: "priya",
    name: "Priya",
    gender: "Women",
    style: "Smart",
    expression: "Cheerful",
    icon: "🤓",

    src: avatarSrc({
      seed: "PriyaSmart2026",
      background: "eaf7fb",
      skinColor: SKIN.warm,
      hairColor: HAIR.black,
      topVariant: "straight01",
      eyesVariant: "happy",
      eyebrowsVariant: "defaultNatural",
      mouthVariant: "smile",
      accessoriesVariant: "prescription01",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "a7ffc4",
    }),
  },

  {
    id: "meera",
    name: "Meera",
    gender: "Women",
    style: "Friendly",
    expression: "Cheerful",
    icon: "🥰",

    src: avatarSrc({
      seed: "MeeraFriendly2026",
      background: "e9f8f3",
      skinColor: SKIN.light,
      hairColor: HAIR.brown,
      topVariant: "curvy",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      clothesVariant: "shirtScoopNeck",
      clothesColor: "a7ffc4",
    }),
  },

  {
    id: "sara",
    name: "Sara",
    gender: "Women",
    style: "Modern",
    expression: "Smile",
    icon: "👓",

    src: avatarSrc({
      seed: "SaraModern2026",
      background: "eef0ff",
      skinColor: SKIN.brown,
      hairColor: HAIR.black,
      topVariant: "bob",
      eyesVariant: "happy",
      eyebrowsVariant: "defaultNatural",
      mouthVariant: "smile",
      accessoriesVariant: "prescription02",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "ff5c5c",
    }),
  },

  {
    id: "zara",
    name: "Zara",
    gender: "Women",
    style: "Casual",
    expression: "Happy",
    icon: "✨",

    src: avatarSrc({
      seed: "ZaraCasual2026",
      background: "fff4e8",
      skinColor: SKIN.fair,
      hairColor: HAIR.darkBrown,
      topVariant: "longWavy",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      clothesVariant: "hoodie",
      clothesColor: "65c9ff",
    }),
  },

  {
    id: "aisha",
    name: "Aisha",
    gender: "Women",
    style: "Executive",
    expression: "Confident",
    icon: "💼",

    src: avatarSrc({
      seed: "AishaExecutive2026",
      background: "eef0ff",
      skinColor: SKIN.brown,
      hairColor: HAIR.black,
      topVariant: "longButNotTooLong",
      eyesVariant: "happy",
      eyebrowsVariant: "defaultNatural",
      mouthVariant: "smile",
      clothesVariant: "blazerAndShirt",
      clothesColor: "5199e4",
    }),
  },

  {
    id: "kiara",
    name: "Kiara",
    gender: "Women",
    style: "Trendy",
    expression: "Cool",
    icon: "😎",

    src: avatarSrc({
      seed: "KiaraTrendy2026",
      background: "eaf7fb",
      skinColor: SKIN.light,
      hairColor: HAIR.brown,
      topVariant: "straight02",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      accessoriesVariant: "sunglasses",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "c0aede",
    }),
  },

  {
    id: "riya",
    name: "Riya",
    gender: "Women",
    style: "Creative",
    expression: "Happy",
    icon: "🌸",

    src: avatarSrc({
      seed: "RiyaCreative2026",
      background: "fff0f5",
      skinColor: SKIN.fair,
      hairColor: HAIR.darkBrown,
      topVariant: "frida",
      eyesVariant: "happy",
      eyebrowsVariant: "raisedExcited",
      mouthVariant: "smile",
      clothesVariant: "shirtScoopNeck",
      clothesColor: "ff5c5c",
    }),
  },

  {
    id: "neha",
    name: "Neha",
    gender: "Women",
    style: "Relaxed",
    expression: "Friendly",
    icon: "🌿",

    src: avatarSrc({
      seed: "NehaRelaxed2026",
      background: "e8f7f4",
      skinColor: SKIN.warm,
      hairColor: HAIR.black,
      topVariant: "bun",
      eyesVariant: "happy",
      eyebrowsVariant: "default",
      mouthVariant: "smile",
      clothesVariant: "shirtCrewNeck",
      clothesColor: "a7ffc4",
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
   AVATAR IMAGE
   ============================================================ */

function AvatarImage({
  src,
  alt,
  size = 84,
  selected = false,
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #eef8fb, #dff1f6)",
        border: "4px solid #ffffff",
        boxShadow: selected
          ? "0 10px 28px rgba(16,121,159,.22)"
          : "0 8px 22px rgba(16,77,96,.13)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      {!imageError ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImageError(true)}
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />
      ) : (
        <FaceRoundedIcon
          sx={{
            fontSize: size * 0.48,
            color: COLORS.primary,
          }}
        />
      )}
    </Box>
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
  const [selectedAvatar, setSelectedAvatar] =
    useState(currentAvatar || AVATAR_OPTIONS[0].src);

  const [filter, setFilter] = useState("All");

  const [previewAvatar, setPreviewAvatar] =
    useState(null);

  useEffect(() => {
    if (open) {
      setSelectedAvatar(
        currentAvatar || AVATAR_OPTIONS[0].src
      );

      setPreviewAvatar(
        AVATAR_OPTIONS.find(
          (item) =>
            item.src ===
            (currentAvatar || AVATAR_OPTIONS[0].src)
        ) || AVATAR_OPTIONS[0]
      );

      setFilter("All");
    }
  }, [open, currentAvatar]);

  const filteredAvatars = useMemo(() => {
    if (filter === "All") {
      return AVATAR_OPTIONS;
    }

    return AVATAR_OPTIONS.filter(
      (avatar) => avatar.gender === filter
    );
  }, [filter]);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar.src);
    setPreviewAvatar(avatar);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedAvatar);
    }

    /* fallback persistence */
    try {
      localStorage.setItem(
        "profileAvatar",
        selectedAvatar
      );
    } catch (error) {
      console.warn(
        "Could not save avatar",
        error
      );
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 32px)",
          },

          maxWidth: {
            xs: "none",
            sm: 1050,
          },

          maxHeight: {
            xs: "calc(100vh - 20px)",
            sm: "calc(100vh - 48px)",
          },

          margin: {
            xs: 1,
            sm: 2,
          },

          borderRadius: {
            xs: "20px",
            sm: "26px",
          },

          overflow: "hidden",

          border: `1px solid ${COLORS.border}`,

          boxShadow:
            "0 30px 90px rgba(16,77,96,.22)",

          background: COLORS.white,
        },
      }}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <DialogTitle
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },

          pt: {
            xs: 1.8,
            sm: 2.5,
          },

          pb: 1.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            minWidth={0}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg,#edf8fb,#dff1f6)",
                border: `1px solid ${COLORS.primary}25`,
                color: COLORS.primary,
                flexShrink: 0,
              }}
            >
              <AutoAwesomeRoundedIcon />
            </Box>

            <Box minWidth={0}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.18rem",
                  },

                  fontWeight: 900,

                  color: COLORS.ink,

                  lineHeight: 1.15,
                }}
              >
                Choose your avatar
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,

                  fontSize: {
                    xs: ".64rem",
                    sm: ".7rem",
                  },

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
            sx={{
              width: 38,
              height: 38,

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
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* ======================================================
          FILTERS
          ====================================================== */}

      <Box
        sx={{
          px: {
            xs: 1.7,
            sm: 3,
          },

          pt: 1.5,

          pb: 1,

          overflowX: "auto",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            width: "max-content",
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
            const active =
              filter === item.value;

            return (
              <Chip
                key={item.value}
                icon={React.cloneElement(
                  item.icon,
                  {
                    sx: {
                      fontSize: 17,
                    },
                  }
                )}
                label={item.label}
                onClick={() =>
                  setFilter(item.value)
                }
                sx={{
                  height: {
                    xs: 36,
                    sm: 38,
                  },

                  px: 0.5,

                  borderRadius: "11px",

                  fontWeight: 800,

                  fontSize: ".7rem",

                  color: active
                    ? COLORS.white
                    : COLORS.slate,

                  background: active
                    ? `linear-gradient(
                        135deg,
                        ${COLORS.primary},
                        ${COLORS.primaryDark}
                      )`
                    : "#f6fafc",

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
                      ? COLORS.primaryDark
                      : COLORS.aquaPale,
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* ======================================================
          PREVIEW
          ====================================================== */}

      {previewAvatar && (
        <Box
          sx={{
            mx: {
              xs: 1.7,
              sm: 3,
            },

            mt: 0.5,

            mb: 1,

            px: {
              xs: 1.2,
              sm: 1.6,
            },

            py: 1,

            borderRadius: "14px",

            background:
              "linear-gradient(135deg,#f4fbfd,#eef8fb)",

            border: `1px solid ${COLORS.border}`,

            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            gap: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            minWidth={0}
          >
            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AvatarImage
                src={previewAvatar.src}
                alt={previewAvatar.name}
                size={58}
                selected
              />
            </motion.div>

            <Box minWidth={0}>
              <Typography
                sx={{
                  fontSize: ".72rem",
                  fontWeight: 900,
                  color: COLORS.ink,
                }}
              >
                {previewAvatar.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: ".6rem",
                  color: COLORS.muted,
                  fontWeight: 650,
                  mt: 0.2,
                }}
              >
                {previewAvatar.style} •{" "}
                {previewAvatar.expression}
              </Typography>
            </Box>
          </Stack>

          <Chip
            size="small"
            icon={
              <SentimentSatisfiedAltRoundedIcon
                sx={{ fontSize: 15 }}
              />
            }
            label="Selected"
            sx={{
              flexShrink: 0,

              height: 28,

              borderRadius: "9px",

              fontSize: ".58rem",

              fontWeight: 800,

              background: COLORS.white,

              color: COLORS.primary,

              border: `1px solid ${COLORS.primary}25`,

              "& .MuiChip-icon": {
                color: COLORS.primary,
              },
            }}
          />
        </Box>
      )}

      {/* ======================================================
          AVATAR GRID
          ====================================================== */}

      <DialogContent
        sx={{
          px: {
            xs: 1.5,
            sm: 3,
          },

          pb: 2,

          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            background:
              `${COLORS.primary}35`,
            borderRadius: 10,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },

            gap: {
              xs: 1,
              sm: 1.4,
              md: 1.6,
            },

            mt: 0.5,
          }}
        >
          {filteredAvatars.map(
            (avatar, index) => {
              const isSelected =
                selectedAvatar ===
                avatar.src;

              return (
                <motion.button
                  key={avatar.id}
                  type="button"
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay:
                      Math.min(index, 10) *
                      0.025,
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.025,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() =>
                    handleSelect(avatar)
                  }
                  style={{
                    border: "none",

                    background:
                      "transparent",

                    padding: 0,

                    cursor: "pointer",

                    outline: "none",

                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position:
                        "relative",

                      width: "100%",

                      minHeight: {
                        xs: 178,
                        sm: 198,
                        md: 210,
                      },

                      borderRadius: {
                        xs: "16px",
                        sm: "18px",
                      },

                      display: "flex",

                      flexDirection:
                        "column",

                      alignItems: "center",

                      justifyContent:
                        "center",

                      background:
                        isSelected
                          ? "linear-gradient(145deg,#eef9fc,#e4f5f9)"
                          : "#f9fcfd",

                      border: isSelected
                        ? `2px solid ${COLORS.primary}`
                        : `1px solid ${COLORS.border}`,

                      boxShadow:
                        isSelected
                          ? "0 12px 30px rgba(16,121,159,.18)"
                          : "0 5px 16px rgba(16,77,96,.05)",

                      transition:
                        "all .2s ease",

                      overflow: "hidden",

                      p: {
                        xs: 1,
                        sm: 1.3,
                      },
                    }}
                  >
                    {/* TOP DECORATION */}

                    <Box
                      sx={{
                        position:
                          "absolute",

                        top: 0,

                        left: 0,

                        right: 0,

                        height: 3,

                        background:
                          isSelected
                            ? COLORS.primary
                            : "transparent",
                      }}
                    />

                    {/* AVATAR */}

                    <motion.div
                      animate={{
                        y: isSelected
                          ? [0, -2, 0]
                          : 0,
                      }}
                      transition={{
                        duration: 2.5,
                        repeat:
                          isSelected
                            ? Infinity
                            : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <AvatarImage
                        src={avatar.src}
                        alt={`${avatar.name} avatar`}
                        size={
                          window.innerWidth <
                          600
                            ? 76
                            : 92
                        }
                        selected={
                          isSelected
                        }
                      />
                    </motion.div>

                    {/* CHECK */}

                    {isSelected && (
                      <motion.div
                        initial={{
                          scale: 0,
                        }}
                        animate={{
                          scale: 1,
                        }}
                      >
                        <Box
                          sx={{
                            position:
                              "absolute",

                            top: 8,

                            right: 8,

                            width: 25,

                            height: 25,

                            borderRadius:
                              "50%",

                            display:
                              "grid",

                            placeItems:
                              "center",

                            background:
                              COLORS.primary,

                            color:
                              COLORS.white,

                            border:
                              "2px solid white",

                            boxShadow:
                              "0 5px 12px rgba(16,121,159,.28)",
                          }}
                        >
                          <CheckRoundedIcon
                            sx={{
                              fontSize: 14,
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}

                    {/* NAME */}

                    <Typography
                      sx={{
                        mt: 0.8,

                        fontSize: {
                          xs: ".68rem",
                          sm: ".72rem",
                        },

                        fontWeight: 900,

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
                        mt: 0.35,

                        fontSize: {
                          xs: ".53rem",
                          sm: ".56rem",
                        },

                        color:
                          COLORS.muted,

                        fontWeight: 650,
                      }}
                    >
                      {avatar.style}
                    </Typography>

                    {/* EXPRESSION */}

                    <Typography
                      sx={{
                        mt: 0.25,

                        fontSize: {
                          xs: ".49rem",
                          sm: ".51rem",
                        },

                        color:
                          COLORS.primary,

                        fontWeight: 750,
                      }}
                    >
                      {avatar.expression}
                    </Typography>
                  </Box>
                </motion.button>
              );
            }
          )}
        </Box>

        {/* EMPTY */}

        {filteredAvatars.length ===
          0 && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <SentimentSatisfiedAltRoundedIcon
              sx={{
                fontSize: 46,
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

      {/* ======================================================
          ACTIONS
          ====================================================== */}

      <DialogActions
        sx={{
          px: {
            xs: 1.7,
            sm: 3,
          },

          py: {
            xs: 1.3,
            sm: 1.8,
          },

          borderTop:
            `1px solid ${COLORS.border}`,

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
            minHeight: 42,

            px: 2.3,

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
              background:
                COLORS.aquaPale,
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
            <CheckRoundedIcon />
          }
          sx={{
            minHeight: 42,

            px: 2.5,

            borderRadius: "11px",

            background:
              `linear-gradient(
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
              background:
                `linear-gradient(
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
  const prefersReducedMotion =
    useMediaQuery(
      "(prefers-reduced-motion: reduce)"
    );

  const [avatarPickerOpen, setAvatarPickerOpen] =
    useState(false);

  /*
   * First priority:
   * user.avatarUrl
   *
   * Second priority:
   * localStorage
   *
   * Third priority:
   * first default avatar
   */

  const [savedAvatar, setSavedAvatar] =
    useState(() => {
      try {
        return localStorage.getItem(
          "profileAvatar"
        );
      } catch {
        return null;
      }
    });

  const avatarUrl =
    user?.avatarUrl ||
    savedAvatar ||
    AVATAR_OPTIONS[0].src;

  const handleAvatarChange = (
    newAvatar
  ) => {
    setSavedAvatar(newAvatar);

    try {
      localStorage.setItem(
        "profileAvatar",
        newAvatar
      );
    } catch (error) {
      console.warn(
        "Could not persist avatar",
        error
      );
    }

    if (onAvatarChange) {
      onAvatarChange(newAvatar);
    }
  };

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

            border:
              `1px solid ${COLORS.border}`,

            background:
              `linear-gradient(
                135deg,
                ${COLORS.white} 0%,
                ${COLORS.aquaPale} 100%
              )`,

            boxShadow:
              "0 4px 18px rgba(16,77,96,.06)",

            transition:
              "box-shadow .25s ease",

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
              alignItems="center"
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              {/* =================================================
                  AVATAR AREA
                  ================================================= */}

              <Box
                sx={{
                  position:
                    "relative",

                  flexShrink: 0,

                  width: {
                    xs: 106,
                    sm: 118,
                  },

                  height: {
                    xs: 106,
                    sm: 118,
                  },

                  display: "grid",

                  placeItems: "center",
                }}
              >
                {/* GLOW */}

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
                    position:
                      "absolute",

                    inset: 0,

                    borderRadius: "50%",

                    background:
                      `radial-gradient(
                        circle,
                        ${COLORS.aqua}35,
                        transparent 68%
                      )`,
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
                    position:
                      "absolute",

                    inset: 2,

                    borderRadius:
                      "50%",
                  }}
                >
                  <Box
                    sx={{
                      position:
                        "absolute",

                      top: 3,

                      left: "50%",

                      transform:
                        "translateX(-50%)",

                      width: 6,

                      height: 6,

                      borderRadius:
                        "50%",

                      background:
                        COLORS.primary,

                      opacity: 0.7,
                    }}
                  />

                  <Box
                    sx={{
                      position:
                        "absolute",

                      bottom: 10,

                      right: 7,

                      width: 5,

                      height: 5,

                      borderRadius:
                        "50%",

                      background:
                        COLORS.aqua,

                      opacity: 0.8,
                    }}
                  />
                </motion.div>

                {/* CLICKABLE AVATAR */}

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
                    setAvatarPickerOpen(
                      true
                    )
                  }
                  aria-label="Change profile avatar"
                  style={{
                    position:
                      "relative",

                    zIndex: 2,

                    border: "none",

                    padding: 0,

                    background:
                      "transparent",

                    cursor: "pointer",

                    borderRadius: "50%",
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
                    <AvatarImage
                      src={avatarUrl}
                      alt={
                        user?.name ||
                        "Profile avatar"
                      }
                      size={
                        window.innerWidth <
                        600
                          ? 88
                          : 100
                      }
                      selected
                    />
                  </motion.div>

                  {/* CAMERA */}

                  <Box
                    sx={{
                      position:
                        "absolute",

                      right: 0,

                      bottom: 0,

                      width: 30,

                      height: 30,

                      borderRadius:
                        "50%",

                      display:
                        "grid",

                      placeItems:
                        "center",

                      background:
                        COLORS.white,

                      color:
                        COLORS.primary,

                      border:
                        `1px solid ${COLORS.border}`,

                      boxShadow:
                        "0 5px 13px rgba(16,77,96,.15)",
                    }}
                  >
                    <CameraAltRoundedIcon
                      sx={{
                        fontSize: 15,
                      }}
                    />
                  </Box>
                </motion.button>

                {/* ONLINE */}

                <Box
                  sx={{
                    position:
                      "absolute",

                    zIndex: 4,

                    bottom: 8,

                    right: 8,

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

              {/* =================================================
                  USER INFORMATION
                  ================================================= */}

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

                {/* CONTACT */}

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

              {/* =================================================
                  EDIT BUTTON
                  ================================================= */}

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

                  background:
                    `linear-gradient(
                      135deg,
                      ${COLORS.primary},
                      ${COLORS.primaryDark}
                    )`,

                  color:
                    COLORS.white,

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
                    background:
                      `linear-gradient(
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

      {/* ========================================================
          AVATAR DIALOG
          ======================================================== */}

      <AvatarPicker
        open={avatarPickerOpen}
        onClose={() =>
          setAvatarPickerOpen(false)
        }
        currentAvatar={avatarUrl}
        onConfirm={
          handleAvatarChange
        }
      />
    </>
  );
}
