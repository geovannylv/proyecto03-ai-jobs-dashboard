import { Box, Typography } from '@mui/material';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { JobRecord } from '../types/job';
import { buildMonthlyDemand } from '../utils/metrics';

export interface MonthlyDemandChartProps {
  rows: JobRecord[];
}

export function MonthlyDemandChart({ rows }: MonthlyDemandChartProps) {
  const data = buildMonthlyDemand(rows);

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No hay registros mensuales para los filtros actuales.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: { xs: 270, sm: 300 } }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 14, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="monthLabel"
            interval="preserveStartEnd"
            minTickGap={12}
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            width={36}
            allowDecimals={false}
            tick={{ fill: '#475569', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              borderColor: '#cbd5e1',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="y2025"
            name="Publicaciones 2025"
            stroke="#0f172a"
            strokeWidth={2.5}
            dot={{ r: 3.5 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="y2026"
            name="Publicaciones 2026"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            dot={{ r: 3.5 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
