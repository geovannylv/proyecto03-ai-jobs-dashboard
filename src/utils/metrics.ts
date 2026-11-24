import type { JobFilters, JobRecord } from '../types/job';

export const EXPERIENCE_ORDER = [
  'Entry (0-2 yrs)',
  'Mid (3-5 yrs)',
  'Senior (6-9 yrs)',
  'Lead (10+ yrs)',
] as const;

export const REMOTE_MODES = ['Fully Remote', 'Hybrid', 'On-site'] as const;

const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

/**
 * Filtra los registros de empleo de acuerdo con los selectores y búsqueda activa.
 */
export function filterJobs(jobs: JobRecord[], filters: JobFilters): JobRecord[] {
  const query = filters.search.trim().toLowerCase();

  return jobs.filter((job) => {
    if (filters.experience !== 'ALL' && job.experience_level !== filters.experience) {
      return false;
    }
    if (filters.country !== 'ALL' && job.country !== filters.country) {
      return false;
    }
    if (filters.remoteWork !== 'ALL' && job.remote_work !== filters.remoteWork) {
      return false;
    }
    if (query) {
      const haystack = `${job.job_title} ${job.required_skills} ${job.job_category} ${job.city}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Calcula la mediana numérica de un arreglo de valores.
 */
export function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calcula el promedio simple de un arreglo de valores.
 */
export function computeAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((acc, value) => acc + value, 0);
  return total / values.length;
}

export interface DashboardKpis {
  medianSalaryUsd: number;
  avgSalaryPremiumPct: number;
  avgDemandScore: number;
  llmRolePct: number;
  totalFiltered: number;
}

/**
 * Calcula los 4 KPIs principales sobre los registros filtrados sin modificar los valores originales.
 */
export function computeDashboardKpis(rows: JobRecord[]): DashboardKpis {
  if (rows.length === 0) {
    return {
      medianSalaryUsd: 0,
      avgSalaryPremiumPct: 0,
      avgDemandScore: 0,
      llmRolePct: 0,
      totalFiltered: 0,
    };
  }

  const medianSalaryUsd = computeMedian(rows.map((r) => r.annual_salary_usd));
  const avgSalaryPremiumPct = computeAverage(rows.map((r) => r.ai_salary_premium_pct));
  const avgDemandScore = computeAverage(rows.map((r) => r.demand_score));
  const llmCount = rows.reduce((acc, r) => acc + (r.is_llm_role === 1 ? 1 : 0), 0);
  const llmRolePct = (llmCount / rows.length) * 100;

  return {
    medianSalaryUsd,
    avgSalaryPremiumPct,
    avgDemandScore,
    llmRolePct,
    totalFiltered: rows.length,
  };
}

export interface SalaryByExperiencePoint {
  experienceLevel: string;
  shortLabel: string;
  avgSalaryUsd: number;
  count: number;
}

/**
 * Agrupa los registros filtrados por nivel de experiencia y calcula el salario promedio anual.
 */
export function buildSalaryByExperience(rows: JobRecord[]): SalaryByExperiencePoint[] {
  const grouped = new Map<string, { sum: number; count: number }>();

  for (const row of rows) {
    const current = grouped.get(row.experience_level) ?? { sum: 0, count: 0 };
    current.sum += row.annual_salary_usd;
    current.count += 1;
    grouped.set(row.experience_level, current);
  }

  const orderedKeys = [
    ...EXPERIENCE_ORDER.filter((lvl) => grouped.has(lvl)),
    ...Array.from(grouped.keys()).filter(
      (lvl) => !EXPERIENCE_ORDER.includes(lvl as (typeof EXPERIENCE_ORDER)[number])
    ),
  ];

  return orderedKeys.map((level) => {
    const entry = grouped.get(level)!;
    return {
      experienceLevel: level,
      shortLabel: level.split(' ')[0],
      avgSalaryUsd: Math.round(entry.sum / entry.count),
      count: entry.count,
    };
  });
}

export interface MonthlyDemandPoint {
  month: number;
  monthLabel: string;
  y2025: number;
  y2026: number;
}

/**
 * Agrupa las publicaciones por mes comparando los años 2025 y 2026.
 */
export function buildMonthlyDemand(rows: JobRecord[]): MonthlyDemandPoint[] {
  const months: MonthlyDemandPoint[] = MONTH_LABELS.map((label, index) => ({
    month: index + 1,
    monthLabel: label,
    y2025: 0,
    y2026: 0,
  }));

  for (const row of rows) {
    const idx = row.posting_month - 1;
    if (idx < 0 || idx >= 12) continue;
    if (row.posting_year === 2025) {
      months[idx].y2025 += 1;
    } else if (row.posting_year === 2026) {
      months[idx].y2026 += 1;
    }
  }

  return months;
}

export interface CategoryPoint {
  name: string;
  value: number;
  sharePct: number;
}

/**
 * Resume las seis categorías laborales con mayor número de registros.
 */
export function buildTopCategories(rows: JobRecord[], limit = 6): CategoryPoint[] {
  if (rows.length === 0) return [];

  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.job_category, (counts.get(row.job_category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({
      name,
      value,
      sharePct: Number(((value / rows.length) * 100).toFixed(1)),
    }));
}

export function formatCurrencyUsd(value: number): string {
  return `USD ${Math.round(value).toLocaleString('es-EC')}`;
}
