import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, subtitle, children, className, action }: ChartCardProps) {
  return (
    <Paper
      elevation={0}
      className={className}
      sx={{
        p: { xs: 2, md: 2.5 },
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontSize: '1.02rem', color: '#0f172a' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
            {subtitle}
          </Typography>
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Stack>

      <Box sx={{ width: '100%' }}>{children}</Box>
    </Paper>
  );
}
