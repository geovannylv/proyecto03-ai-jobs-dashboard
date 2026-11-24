import type { JobRecord } from '../types/job';

const CSV_COLUMNS: Array<keyof JobRecord> = [
  'job_id',
  'job_title',
  'job_category',
  'experience_level',
  'years_of_experience',
  'education_required',
  'annual_salary_usd',
  'salary_min_usd',
  'salary_max_usd',
  'city',
  'country',
  'remote_work',
  'company_size',
  'industry',
  'required_skills',
  'ai_salary_premium_pct',
  'demand_score',
  'demand_growth_yoy_pct',
  'benefits_score_10',
  'posting_year',
  'posting_month',
  'is_senior',
  'is_remote_friendly',
  'is_llm_role',
  'salary_tier',
];

function escapeCsvField(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Genera y descarga un archivo CSV con los registros actualmente filtrados.
 */
export function exportJobsToCsv(rows: JobRecord[], filename = 'ai_jobs_filtered.csv'): void {
  const header = CSV_COLUMNS.join(',');
  const body = rows
    .map((row) => CSV_COLUMNS.map((col) => escapeCsvField(row[col])).join(','))
    .join('\r\n');

  const csvContent = `\uFEFF${header}\r\n${body}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
