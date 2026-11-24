export interface JobRecord {
  job_id: string;
  job_title: string;
  job_category: string;
  experience_level: string;
  years_of_experience: number;
  education_required: string;
  annual_salary_usd: number;
  salary_min_usd: number;
  salary_max_usd: number;
  city: string;
  country: string;
  remote_work: string;
  company_size: string;
  industry: string;
  required_skills: string;
  ai_salary_premium_pct: number;
  demand_score: number;
  demand_growth_yoy_pct: number;
  benefits_score_10: number;
  posting_year: number;
  posting_month: number;
  is_senior: number;
  is_remote_friendly: number;
  is_llm_role: number;
  salary_tier: string;
}

export interface JobFilters {
  experience: string;
  country: string;
  remoteWork: string;
  search: string;
}

export const INITIAL_FILTERS: JobFilters = {
  experience: 'ALL',
  country: 'ALL',
  remoteWork: 'ALL',
  search: '',
};

export type KpiTone = 'primary' | 'success' | 'info' | 'warning';
