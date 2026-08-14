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
  hidden: { opacity: 0, y: 20 }, 
  visible: {  
    opacity: 1,  
    y: 0,  
    transition: { duration: 0.5, delay, ease: 'easeOut' }  
  }, 
}); 
 
export default function ProfileHeader({ user, onEditClick }) { 
  return ( 
    <motion.div variants={fadeUp(0)} initial="hidden" animate="visible"> 
      <Card 
        sx={{ 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.25)', 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(24px)', 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', 
          overflow: 'hidden', 
          transition: 'all 0.3s ease', 
          '&:hover': { 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)', 
            transform: 'translateY(-4px)', 
          }, 
        }} 
      > 
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}> 
          <Grid container spacing={3} alignItems="flex-start"> 
            {/* Avatar Section */} 
            <Grid item xs={12} sm="auto"> 
              <Box sx={{ position: 'relative', display: 'inline-block' }}> 
                <Avatar 
                  sx={{ 
                    width: { xs: 80, sm: 96, md: 110 }, 
                    height: { xs: 80, sm: 96, md: 110 }, 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', 
                    fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' }, 
                    fontWeight: 900, 
                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)', 
                    border: '4px solid white', 
                  }} 
                > 
                  {user.initials} 
                </Avatar> 
                {/* Online Status */} 
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 4, 
                    right: 4, 
                    width: 22, 
                    height: 22, 
                    backgroundColor: '#22c55e', 
                    borderRadius: '50%', 
                    border: '3px solid white', 
                    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)', 
                  }} 
                /> 
              </Box> 
            </Grid> 
 
            {/* User Information */} 
            <Grid item xs={12} sm> 
              <Stack spacing={1.5}> 
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: 'text.primary', 
                    textAlign: { xs: 'center', sm: 'left' }, 
                    letterSpacing: '-0.025em', 
                    fontSize: { xs: '1.75rem', sm: '2.25rem' }, 
                  }} 
                > 
                  {user.name} 
                </Typography> 
 
                <Typography 
                  sx={{ 
                    color: '#4f46e5', 
                    fontWeight: 700, 
                    fontSize: '1rem', 
                    textAlign: { xs: 'center', sm: 'left' }, 
                  }} 
                > 
                  {user.role || 'Store Owner'} 
                </Typography> 
 
                {/* Contact Details */} 
                <Stack 
                  direction="row" 
                  spacing={{ xs: 2, sm: 4 }} 
                  sx={{ 
                    flexWrap: 'wrap', 
                    justifyContent: { xs: 'center', sm: 'flex-start' }, 
                    mt: 1, 
                  }} 
                > 
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}> 
                    <Email sx={{ fontSize: '1.1rem', color: 'text.secondary' }} /> 
                    <Typography 
                      sx={{ 
                        fontSize: '0.95rem', 
                        color: 'text.secondary', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                      }} 
                    > 
                      {user.email} 
                    </Typography> 
                  </Stack> 
 
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}> 
                    <Phone sx={{ fontSize: '1.1rem', color: 'text.secondary' }} /> 
                    <Typography 
                      sx={{ 
                        fontSize: '0.95rem', 
                        color: 'text.secondary', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                      }} 
                    > 
                      {user.phone || 'Not provided'} 
                    </Typography> 
                  </Stack> 
 
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}> 
                    <LocationOn sx={{ fontSize: '1.1rem', color: 'text.secondary' }} /> 
                    <Typography 
                      sx={{ 
                        fontSize: '0.95rem', 
                        color: 'text.secondary', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                      }} 
                    > 
                      {user.location} 
                    </Typography> 
                  </Stack> 
                </Stack> 
              </Stack> 
            </Grid> 
 
            {/* Edit Profile Button */} 
            <Grid item xs={12} sm="auto"> 
              <Button 
                onClick={onEditClick} 
                variant="contained" 
                startIcon={<EditIcon />} 
                sx={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', 
                  color: 'white', 
                  fontWeight: 700, 
                  textTransform: 'none', 
                  fontSize: '0.95rem', 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)', 
                  minWidth: { xs: '100%', sm: '180px' }, 
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', 
                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)', 
                    transform: 'translateY(-2px)', 
                  }, 
                  '&:active': { 
                    transform: 'scale(0.96)', 
                  }, 
                  transition: 'all 0.2s ease', 
                }} 
              > 
                Edit Profile 
              </Button> 
            </Grid> 
          </Grid> 
        </CardContent> 
      </Card> 
    </motion.div> 
  ); 
}
