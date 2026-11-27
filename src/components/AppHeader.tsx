import InsightsIcon from '@mui/icons-material/Insights';
import PublicIcon from '@mui/icons-material/Public';
import StorageIcon from '@mui/icons-material/Storage';
import { Box, Chip, Stack, Typography } from '@mui/material';

export interface AppHeaderProps {
  totalJobs: number;
}

export function AppHeader({ totalJobs }: AppHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#0f172a',
        color: '#f8fafc',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        py: { xs: 2.25, md: 2.75 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1380, mx: 'auto' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={{ xs: 2, md: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: 'rgba(14, 165, 233, 0.16)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                flexShrink: 0,
              }}
            >
              <InsightsIcon />
            </Box>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: '#94a3b8',
                  letterSpacing: '0.08em',
                  lineHeight: 1.2,
                  display: 'block',
                }}
              >
                PROYECTO 03 · ANÁLISIS DEL MERCADO LABORAL EN IA
              </Typography>
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.45rem' }, lineHeight: 1.25 }}
              >
                AI Jobs Market 2025–2026: Salarios, Habilidades y Demanda
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<PublicIcon sx={{ color: '#38bdf8 !important' }} />}
              label="Alcance global · Cortes 2025–2026"
              size="small"
              sx={{
                bgcolor: 'rgba(30, 41, 59, 0.9)',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.25)',
              }}
            />
            <Chip
              icon={<StorageIcon sx={{ color: '#4ade80 !important' }} />}
              label={
                totalJobs > 0
                  ? `${totalJobs.toLocaleString('es-EC')} registros cargados`
                  : 'Sincronizando registros...'
              }
              size="small"
              sx={{
                bgcolor: 'rgba(21, 128, 61, 0.22)',
                color: '#bbf7d0',
                border: '1px solid rgba(74, 222, 128, 0.35)',
                fontWeight: 600,
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
