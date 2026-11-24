import { Box, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { JobRecord } from '../types/job';
import { buildSalaryByExperience, formatCurrencyUsd } from '../utils/metrics';

export interface SalaryByExperienceChartProps {
  rows: JobRecord[];
}

export function SalaryByExperienceChart({ rows }: SalaryByExperienceChartProps) {
  const data = buildSalaryByExperience(rows);

  if (data.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No hay registros para mostrar con los filtros seleccionados.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="shortLabel"
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val: number) => `$${Math.round(val / 1000)}k`}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrencyUsd(value), 'Salario promedio']}
            labelFormatter={(_label, payload) => {
              const point = payload?.[0]?.payload as { experienceLevel?: string; count?: number } | undefined;
              return point
                ? `${point.experienceLevel} (${point.count} ofertas)`
                : '';
            }}
            contentStyle={{
              borderRadius: 10,
              borderColor: '#cbd5e1',
              fontSize: 13,
            }}
          />
          <Bar dataKey="avgSalaryUsd" fill="#0369a1" radius={[8, 8, 0, 0]} maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
