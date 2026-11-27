import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { JobFilters } from '../types/job';
import { EXPERIENCE_ORDER, REMOTE_MODES } from '../utils/metrics';

export interface FilterPanelProps {
  filters: JobFilters;
  countries: string[];
  onChange: (field: keyof JobFilters, value: string) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, countries, onChange, onReset }: FilterPanelProps) {
  const hasActiveFilters =
    filters.experience !== 'ALL' ||
    filters.country !== 'ALL' ||
    filters.remoteWork !== 'ALL' ||
    filters.search.trim() !== '';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 2.5 },
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        bgcolor: '#ffffff',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={0.5}
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
          Filtros globales
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          Ajusta los criterios para recalcular KPIs, gráficos y ofertas
        </Typography>
      </Stack>

      <Box className="filters-grid">
        <FormControl size="small" fullWidth>
          <InputLabel id="filter-experience-label">Experiencia</InputLabel>
          <Select
            labelId="filter-experience-label"
            label="Experiencia"
            value={filters.experience}
            onChange={(e) => onChange('experience', e.target.value)}
          >
            <MenuItem value="ALL">Todos los niveles</MenuItem>
            {EXPERIENCE_ORDER.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="filter-country-label">País / Región</InputLabel>
          <Select
            labelId="filter-country-label"
            label="País / Región"
            value={filters.country}
            onChange={(e) => onChange('country', e.target.value)}
          >
            <MenuItem value="ALL">Todos los países</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="filter-remote-label">Modalidad</InputLabel>
          <Select
            labelId="filter-remote-label"
            label="Modalidad"
            value={filters.remoteWork}
            onChange={(e) => onChange('remoteWork', e.target.value)}
          >
            <MenuItem value="ALL">Todas las modalidades</MenuItem>
            {REMOTE_MODES.map((mode) => (
              <MenuItem key={mode} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          className="filters-search"
          size="small"
          fullWidth
          label="Buscar puesto o habilidad"
          placeholder="Ej. LLM, Python, RAG..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box className="filters-actions" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
            disabled={!hasActiveFilters}
            sx={{ whiteSpace: 'nowrap', height: 40, width: { xs: '100%', sm: 'auto' } }}
          >
            Restablecer
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
