import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const fadeUp = (delay = 0) => ({
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

const avatarAnimation = {
  hidden: {
    opacity: 0,
    scale: 0.85,
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

const contentAnimation = {
  hidden: {
    opacity: 0,
    x: -12,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.14,
      ease: 'easeOut',
    },
  },
};

const buttonAnimation = {
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
      ease: 'easeOut',
    },
  },
};

export default function ProfileHeader({ user, onEditClick }) {
  return (
    <motion.div
      variants={fadeUp(0)}
      initial="hidden"
      animate="visible"
      style={{
        width: '100%',
      }}
    >
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',

          borderRadius: {
            xs: '18px',
            sm: '20px',
            md: '22px',
          },

          border: '1px solid',
          borderColor: 'divider',

          background:
            'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,255,0.96) 100%)',

          boxShadow:
            '0 8px 30px rgba(15, 23, 42, 0.055)',

          transition:
            'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',

          '&:hover': {
            transform: {
              xs: 'none',
              md: 'translateY(-3px)',
            },

            boxShadow:
              '0 18px 45px rgba(15, 23, 42, 0.09)',

            borderColor:
              'rgba(99, 102, 241, 0.2)',
          },

          /* ================================================
             Soft background texture
          ================================================= */

          '&::before': {
            content: '""',
            position: 'absolute',

            top: -150,
            right: -100,

            width: 360,
            height: 360,

            borderRadius: '50%',

            background:
              'radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(99,102,241,0.045) 38%, transparent 70%)',

            pointerEvents: 'none',
          },

          '&::after': {
            content: '""',
            position: 'absolute',

            bottom: -180,
            left: -120,

            width: 360,
            height: 360,

            borderRadius: '50%',

            background:
              'radial-gradient(circle, rgba(16,185,129,0.075) 0%, rgba(16,185,129,0.025) 38%, transparent 70%)',

            pointerEvents: 'none',
          },
        }}
      >
        {/* =================================================
            Top accent line
        ================================================= */}

        <Box
          sx={{
            position: 'absolute',

            top: 0,
            left: 0,
            right: 0,

            height: 3,

            background:
              'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',

            zIndex: 3,
          }}
        />

        <CardContent
          sx={{
            position: 'relative',
            zIndex: 2,

            p: {
              xs: 2,
              sm: 2.75,
              md: 3.25,
              lg: 3.5,
            },

            '&:last-child': {
              pb: {
                xs: 2,
                sm: 2.75,
                md: 3.25,
                lg: 3.5,
              },
            },
          }}
        >
          <Grid
            container
            alignItems="center"
            columnSpacing={{
              xs: 0,
              sm: 2.5,
              md: 3,
              lg: 4,
            }}
            rowSpacing={{
              xs: 2,
              sm: 2,
              md: 0,
            }}
          >
            {/* =================================================
                PROFILE AVATAR
            ================================================= */}

            <Grid
              item
              xs={12}
              sm="auto"
            >
              <motion.div
                variants={avatarAnimation}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',

                    width: {
                      xs: 76,
                      sm: 88,
                      md: 96,
                    },

                    height: {
                      xs: 76,
                      sm: 88,
                      md: 96,
                    },
                  }}
                >
                  {/* Animated glow */}

                  <Box
                    component={motion.div}
                    animate={{
                      scale: [1, 1.07, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    sx={{
                      position: 'absolute',

                      inset: -7,

                      borderRadius: '50%',

                      background:
                        'radial-gradient(circle, rgba(99,102,241,0.25), transparent 68%)',

                      pointerEvents: 'none',
                    }}
                  />

                  <Avatar
                    sx={{
                      position: 'relative',

                      width: '100%',
                      height: '100%',

                      background:
                        'linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)',

                      color: '#fff',

                      fontSize: {
                        xs: '1.75rem',
                        sm: '2rem',
                        md: '2.2rem',
                      },

                      fontWeight: 800,

                      border: '4px solid',
                      borderColor: '#fff',

                      boxShadow:
                        '0 10px 28px rgba(79,70,229,0.28)',

                      transition:
                        'transform 0.3s ease, box-shadow 0.3s ease',

                      '&:hover': {
                        transform: {
                          xs: 'none',
                          md: 'scale(1.04)',
                        },

                        boxShadow:
                          '0 14px 34px rgba(79,70,229,0.35)',
                      },
                    }}
                  >
                    {user.initials}
                  </Avatar>

                  {/* Online indicator */}

                  <Box
                    component={motion.div}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(34,197,94,0.35)',
                        '0 0 0 6px rgba(34,197,94,0)',
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    sx={{
                      position: 'absolute',

                      right: {
                        xs: 0,
                        sm: 1,
                      },

                      bottom: {
                        xs: 0,
                        sm: 1,
                      },

                      width: {
                        xs: 17,
                        sm: 19,
                      },

                      height: {
                        xs: 17,
                        sm: 19,
                      },

                      borderRadius: '50%',

                      backgroundColor: '#22c55e',

                      border: '3px solid white',

                      zIndex: 5,
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* =================================================
                USER INFORMATION
            ================================================= */}

            <Grid
              item
              xs={12}
              sm
              sx={{
                minWidth: 0,
              }}
            >
              <motion.div variants={contentAnimation}>
                <Stack
                  spacing={0.9}
                  sx={{
                    minWidth: 0,

                    textAlign: {
                      xs: 'center',
                      sm: 'left',
                    },
                  }}
                >
                  {/* Name */}

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 850,

                      color: 'text.primary',

                      letterSpacing: '-0.035em',

                      lineHeight: 1.15,

                      fontSize: {
                        xs: '1.45rem',
                        sm: '1.65rem',
                        md: '1.8rem',
                      },

                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.name}
                  </Typography>

                  {/* Role */}

                  <Typography
                    sx={{
                      color: '#4f46e5',

                      fontWeight: 700,

                      fontSize: {
                        xs: '0.82rem',
                        sm: '0.86rem',
                        md: '0.9rem',
                      },

                      lineHeight: 1.4,
                    }}
                  >
                    {user.role || 'Store Owner'}
                  </Typography>

                  {/* Contact information */}

                  <Stack
                    direction={{
                      xs: 'column',
                      sm: 'row',
                    }}
                    spacing={{
                      xs: 0.6,
                      sm: 1,
                      md: 1.5,
                    }}
                    sx={{
                      mt: 0.5,

                      width: '100%',

                      alignItems: {
                        xs: 'stretch',
                        sm: 'center',
                      },

                      flexWrap: {
                        xs: 'nowrap',
                        sm: 'wrap',
                      },
                    }}
                  >
                    {/* Email */}

                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{
                        minWidth: 0,

                        justifyContent: {
                          xs: 'center',
                          sm: 'flex-start',
                        },

                        px: 0.8,
                        py: 0.55,

                        borderRadius: '8px',

                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',

                        '&:hover': {
                          backgroundColor:
                            'rgba(99,102,241,0.055)',

                          transform: {
                            xs: 'none',
                            md: 'translateY(-1px)',
                          },
                        },
                      }}
                    >
                      <Email
                        sx={{
                          fontSize: {
                            xs: '1rem',
                            sm: '1.05rem',
                          },

                          color: 'text.secondary',

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          minWidth: 0,

                          maxWidth: {
                            xs: '240px',
                            sm: '220px',
                            md: '260px',
                          },

                          fontSize: {
                            xs: '0.76rem',
                            sm: '0.79rem',
                            md: '0.82rem',
                          },

                          color: 'text.secondary',

                          fontWeight: 500,

                          overflow: 'hidden',

                          textOverflow: 'ellipsis',

                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Stack>

                    {/* Phone */}

                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{
                        minWidth: 0,

                        justifyContent: {
                          xs: 'center',
                          sm: 'flex-start',
                        },

                        px: 0.8,
                        py: 0.55,

                        borderRadius: '8px',

                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',

                        '&:hover': {
                          backgroundColor:
                            'rgba(99,102,241,0.055)',

                          transform: {
                            xs: 'none',
                            md: 'translateY(-1px)',
                          },
                        },
                      }}
                    >
                      <Phone
                        sx={{
                          fontSize: {
                            xs: '1rem',
                            sm: '1.05rem',
                          },

                          color: 'text.secondary',

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          minWidth: 0,

                          maxWidth: {
                            xs: '240px',
                            sm: '180px',
                            md: '200px',
                          },

                          fontSize: {
                            xs: '0.76rem',
                            sm: '0.79rem',
                            md: '0.82rem',
                          },

                          color: 'text.secondary',

                          fontWeight: 500,

                          overflow: 'hidden',

                          textOverflow: 'ellipsis',

                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.phone || 'Not provided'}
                      </Typography>
                    </Stack>

                    {/* Location */}

                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{
                        minWidth: 0,

                        justifyContent: {
                          xs: 'center',
                          sm: 'flex-start',
                        },

                        px: 0.8,
                        py: 0.55,

                        borderRadius: '8px',

                        transition:
                          'background-color 0.2s ease, transform 0.2s ease',

                        '&:hover': {
                          backgroundColor:
                            'rgba(99,102,241,0.055)',

                          transform: {
                            xs: 'none',
                            md: 'translateY(-1px)',
                          },
                        },
                      }}
                    >
                      <LocationOn
                        sx={{
                          fontSize: {
                            xs: '1rem',
                            sm: '1.05rem',
                          },

                          color: 'text.secondary',

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          minWidth: 0,

                          maxWidth: {
                            xs: '240px',
                            sm: '180px',
                            md: '200px',
                          },

                          fontSize: {
                            xs: '0.76rem',
                            sm: '0.79rem',
                            md: '0.82rem',
                          },

                          color: 'text.secondary',

                          fontWeight: 500,

                          overflow: 'hidden',

                          textOverflow: 'ellipsis',

                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </motion.div>
            </Grid>

            {/* =================================================
                EDIT PROFILE
            ================================================= */}

            <Grid
              item
              xs={12}
              sm="auto"
              sx={{
                display: 'flex',

                justifyContent: {
                  xs: 'stretch',
                  sm: 'flex-end',
                },
              }}
            >
              <motion.div variants={buttonAnimation}>
                <Button
                  onClick={onEditClick}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'auto',
                    },

                    minWidth: {
                      sm: '145px',
                      md: '155px',
                    },

                    minHeight: {
                      xs: '43px',
                      sm: '45px',
                    },

                    px: {
                      xs: 2,
                      sm: 2.5,
                    },

                    borderRadius: '11px',

                    textTransform: 'none',

                    fontSize: {
                      xs: '0.83rem',
                      sm: '0.86rem',
                    },

                    fontWeight: 700,

                    letterSpacing: '-0.01em',

                    color: '#fff',

                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',

                    boxShadow:
                      '0 7px 20px rgba(79,70,229,0.23)',

                    transition:
                      'transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease',

                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',

                      transform: {
                        xs: 'none',
                        sm: 'translateY(-2px)',
                      },

                      boxShadow:
                        '0 11px 27px rgba(79,70,229,0.32)',
                    },

                    '&:active': {
                      transform: 'scale(0.98)',
                    },

                    '& .MuiButton-startIcon': {
                      transition:
                        'transform 0.22s ease',
                    },

                    '&:hover .MuiButton-startIcon': {
                      transform: 'rotate(-8deg)',
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
