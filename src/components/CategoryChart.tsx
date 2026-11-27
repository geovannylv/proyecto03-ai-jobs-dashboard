import { Box, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { JobRecord } from '../types/job';
import { buildTopCategories } from '../utils/metrics';

export interface CategoryChartProps {
  rows: JobRecord[];
}

const CATEGORY_COLORS = [
  '#0f172a',
  '#0369a1',
  '#0ea5e9',
  '#15803d',
  '#d97706',
  '#6366f1',
];

export function CategoryChart({ rows }: CategoryChartProps) {
  const data = buildTopCategories(rows, 6);

  if (data.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No hay categorías disponibles para mostrar.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      spacing={{ xs: 2.5, sm: 2 }}
      sx={{ minHeight: { xs: 'auto', sm: 300 } }}
    >
      <Box sx={{ width: { xs: '100%', sm: '55%' }, height: { xs: 230, sm: 260 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={88}
              paddingAngle={2}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name, item) => [
                `${value} ofertas (${(item.payload as { sharePct: number }).sharePct.toFixed(1).replace('.', ',')}%)`,
                'Categoría',
              ]}
              contentStyle={{
                borderRadius: 10,
                borderColor: '#cbd5e1',
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack spacing={1.25} sx={{ width: { xs: '100%', sm: '45%' }, px: { xs: 0.5, sm: 0 } }}>
        {data.map((entry, idx) => (
          <Stack
            key={entry.name}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1.5}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" noWrap sx={{ color: '#334155', fontWeight: 500 }}>
                {entry.name}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
              {entry.value} ({entry.sharePct.toFixed(1).replace('.', ',')}%)
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
