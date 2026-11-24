import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { JobRecord } from '../types/job';
import { formatCurrencyUsd } from '../utils/metrics';

export interface JobsTableProps {
  rows: JobRecord[];
}

function getRemoteChipProps(remoteWork: string): {
  color: 'success' | 'info' | 'default';
  variant: 'filled' | 'outlined';
} {
  if (remoteWork === 'Fully Remote') {
    return { color: 'success', variant: 'outlined' };
  }
  if (remoteWork === 'Hybrid') {
    return { color: 'info', variant: 'outlined' };
  }
  return { color: 'default', variant: 'outlined' };
}

export function JobsTable({ rows }: JobsTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [rows]);

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No se encontraron ofertas laborales que coincidan con los filtros actuales.
        </Typography>
      </Box>
    );
  }

  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer className="table-scroll-container">
        <Table size="small" className="table-min-width" aria-label="Tabla de ofertas laborales">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Experiencia</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Ubicación</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#334155' }}>Modalidad</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#334155' }}>
                Salario anual
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((job) => {
              const chipProps = getRemoteChipProps(job.remote_work);
              return (
                <TableRow key={job.job_id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {job.job_title}
                      </Typography>
                      {job.is_llm_role === 1 ? (
                        <Chip
                          label="LLM"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            bgcolor: '#e0f2fe',
                            color: '#0369a1',
                          }}
                        />
                      ) : null}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {job.job_category} · {job.posting_year}-{String(job.posting_month).padStart(2, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary">
                      {job.experience_level}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary">
                      {job.city}, {job.country}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.remote_work}
                      size="small"
                      color={chipProps.color}
                      variant={chipProps.variant}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {formatCurrencyUsd(job.annual_salary_usd)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +{job.ai_salary_premium_pct.toFixed(1)}% prima IA
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_e, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Box>
  );
}
