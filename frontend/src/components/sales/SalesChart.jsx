import React from 'react';
import { Paper, Typography, Box, CircularProgress, Stack } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const SalesChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 4, 
        border: "1px solid", 
        borderColor: "divider", 
        height: 380, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Paper>
    );
  }

  // Fallback / Sample Data for Beautiful Demo
  const chartData = data && data.length > 0 ? data : [
    { name: 'Mon', revenue: 4200, orders: 42 },
    { name: 'Tue', revenue: 3800, orders: 38 },
    { name: 'Wed', revenue: 5200, orders: 52 },
    { name: 'Thu', revenue: 6100, orders: 61 },
    { name: 'Fri', revenue: 4800, orders: 48 },
    { name: 'Sat', revenue: 7100, orders: 71 },
    { name: 'Sun', revenue: 3900, orders: 39 },
  ];

  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      borderRadius: 4, 
      border: "1px solid", 
      borderColor: "divider",
      height: '100%'
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Revenue Overview</Typography>
          <Typography variant="body2" color="text.secondary">Last 7 days performance</Typography>
        </Box>
        <TrendingUp size={24} color="#4f46e5" />
      </Stack>

      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickFormatter={(value) => `₹${value}`} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
              }} 
              itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4f46e5" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SalesChart;