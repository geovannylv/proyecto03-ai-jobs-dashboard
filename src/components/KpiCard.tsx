import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { KpiTone } from '../types/job';

export interface KpiCardProps {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone: KpiTone;
}

const TONE_STYLES: Record<KpiTone, { accent: string; bg: string; iconColor: string }> = {
  primary: {
    accent: '#0f172a',
    bg: '#f1f5f9',
    iconColor: '#0f172a',
  },
  success: {
    accent: '#15803d',
    bg: '#dcfce7',
    iconColor: '#15803d',
  },
  info: {
    accent: '#0369a1',
    bg: '#e0f2fe',
    iconColor: '#0369a1',
  },
  warning: {
    accent: '#b45309',
    bg: '#fef3c7',
    iconColor: '#b45309',
  },
};

export function KpiCard({ label, value, helper, icon, tone }: KpiCardProps) {
  const palette = TONE_STYLES[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${palette.accent}`,
        borderRadius: 3,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.25,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: palette.bg,
            color: palette.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Stack>

      <Typography
        variant="h4"
        component="p"
        sx={{
          fontSize: { xs: '1.35rem', sm: '1.55rem', md: '1.7rem' },
          fontWeight: 800,
          color: '#0f172a',
          lineHeight: 1.15,
          m: 0,
        }}
      >
        {value}
      </Typography>

      <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.35 }}>
        {helper}
      </Typography>
    </Paper>
  );
}
