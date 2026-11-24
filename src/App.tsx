import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { CategoryChart } from './components/CategoryChart';
import { ChartCard } from './components/ChartCard';
import { FilterPanel } from './components/FilterPanel';
import { JobsTable } from './components/JobsTable';
import { KpiCard } from './components/KpiCard';
import { MonthlyDemandChart } from './components/MonthlyDemandChart';
import { SalaryByExperienceChart } from './components/SalaryByExperienceChart';
import { INITIAL_FILTERS, type JobFilters, type JobRecord } from './types/job';
import { exportJobsToCsv } from './utils/csvExport';
import { computeDashboardKpis, filterJobs, formatCurrencyUsd } from './utils/metrics';

export function App() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(INITIAL_FILTERS);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDataset() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/data/ai_jobs_market_2025_2026.json', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status} al cargar el dataset JSON.`);
        }
        const payload = (await response.json()) as JobRecord[];
        setJobs(payload);
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el archivo ai_jobs_market_2025_2026.json.'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDataset();

    return () => {
      controller.abort();
    };
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.country))).sort((a, b) => a.localeCompare(b)),
    [jobs]
  );

  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  const kpis = useMemo(() => computeDashboardKpis(filteredJobs), [filteredJobs]);

  const handleFilterChange = (field: keyof JobFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleExportCsv = () => {
    exportJobsToCsv(filteredJobs);
  };

  return (
    <Box className="dashboard-shell">
      <AppHeader totalJobs={jobs.length} />

      <Box component="main" className="dashboard-main">
        {loading ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 10 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando dataset AI Jobs Market 2025–2026...
            </Typography>
          </Stack>
        ) : error ? (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        ) : (
          <>
            <FilterPanel
              filters={filters}
              countries={countries}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <Box className="kpi-grid" component="section" aria-label="Indicadores clave">
              <KpiCard
                label="Salario mediano anual"
                value={formatCurrencyUsd(kpis.medianSalaryUsd)}
                helper={`Percentil 50 sobre ${kpis.totalFiltered.toLocaleString('es-EC')} ofertas`}
                icon={<PaidIcon fontSize="small" />}
                tone="primary"
              />
              <KpiCard
                label="Prima salarial por IA"
                value={`${kpis.avgSalaryPremiumPct.toFixed(1).replace('.', ',')}%`}
                helper="Promedio de ai_salary_premium_pct"
                icon={<WorkspacePremiumIcon fontSize="small" />}
                tone="success"
              />
              <KpiCard
                label="Índice de demanda"
                value={`${kpis.avgDemandScore.toFixed(1).replace('.', ',')}/100`}
                helper="Puntaje promedio de demand_score"
                icon={<TrendingUpIcon fontSize="small" />}
                tone="info"
              />
              <KpiCard
                label="Roles especializados LLM"
                value={`${kpis.llmRolePct.toFixed(1).replace('.', ',')}%`}
                helper="Registros con indicador is_llm_role = 1"
                icon={<AutoAwesomeIcon fontSize="small" />}
                tone="warning"
              />
            </Box>

            <Box className="charts-grid" component="section" aria-label="Visualizaciones">
              <ChartCard
                title="Salario promedio por nivel de experiencia"
                subtitle="Compensación anual media en USD según seniority"
              >
                <SalaryByExperienceChart rows={filteredJobs} />
              </ChartCard>

              <ChartCard
                title="Categorías de empleo principales"
                subtitle="Top 6 áreas profesionales con mayor cantidad de registros"
              >
                <CategoryChart rows={filteredJobs} />
              </ChartCard>

              <ChartCard
                className="chart-card-wide"
                title="Publicaciones mensuales: comparativa 2025 vs 2026"
                subtitle="Evolución mensual de ofertas registradas por año"
              >
                <MonthlyDemandChart rows={filteredJobs} />
              </ChartCard>
            </Box>

            <ChartCard
              title="Registro detallado de ofertas laborales"
              subtitle={`Mostrando ${filteredJobs.length.toLocaleString('es-EC')} ofertas que cumplen los filtros activos`}
              action={
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportCsv}
                  disabled={filteredJobs.length === 0}
                >
                  Exportar CSV
                </Button>
              }
            >
              <JobsTable rows={filteredJobs} />
            </ChartCard>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', pt: 0.5 }}>
              Fuente: data/ai_jobs_market_2025_2026.json · Se conservan íntegros los 1.500 registros del Sprint 1 sin alteración de valores salariales fuera de rango.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;
