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
        p: { xs: 2.25, md: 2.75 },
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.25,
        minWidth: 0,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1.5}
      >
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontSize: '1.04rem', color: '#0f172a', lineHeight: 1.3 }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem', mt: 0.35 }}>
            {subtitle}
          </Typography>
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Stack>

      <Box sx={{ width: '100%' }}>{children}</Box>
    </Paper>
  );
}
