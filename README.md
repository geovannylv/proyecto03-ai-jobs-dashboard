# Proyecto 03 – AI Jobs Market Dashboard (2025–2026)

Dashboard interactivo desarrollado con React, TypeScript, Vite, Material UI y Recharts para explorar el mercado laboral de Inteligencia Artificial (`AI Jobs Market 2025–2026: Salaries, Skills & Demand`).

## Estructura del proyecto
- `data/ai_jobs_market_2025_2026.csv`: dataset original del Sprint 1.
- `data/ai_jobs_market_2025_2026.json`: registros convertidos a JSON (1,500 ofertas y 25 columnas).
- `public/data/ai_jobs_market_2025_2026.json`: copia servida estáticamente por Vite para carga vía `fetch` en `useEffect`.
- `scripts/csv_to_json.py`: script reproducible de transformación y validación CSV → JSON.
- `src/types/job.ts`: tipos TypeScript para el modelo de ofertas y filtros.
- `src/utils/metrics.ts` y `src/utils/csvExport.ts`: cálculo de KPIs, agregaciones para gráficos, filtrado y exportación a CSV.
- `src/components/`:
  - `AppHeader.tsx`: identidad del dashboard, alcance global y total de registros cargados.
  - `FilterPanel.tsx`: selectores de experiencia, país, modalidad, búsqueda por puesto o habilidad y botón **Restablecer**.
  - `KpiCard.tsx`: tarjeta reutilizable para los cuatro indicadores principales.
  - `ChartCard.tsx`: contenedor reutilizable con título, subtítulo y acciones opcionales.
  - `SalaryByExperienceChart.tsx`: salario promedio anual por nivel de experiencia.
  - `MonthlyDemandChart.tsx`: comparación mensual de publicaciones entre 2025 y 2026.
  - `CategoryChart.tsx`: gráfico circular y leyenda de las 6 categorías con más registros.
  - `JobsTable.tsx`: tabla paginada de ofertas con puesto, experiencia, ubicación, modalidad y salario anual.
- `src/App.tsx`: gestión de estado con `useState`, carga inicial con `useEffect`, memoización con `useMemo` y coordinación por `props`.

## Sprint 1 – Transformación CSV a JSON

Requiere Python 3 (solo biblioteca estándar):

```bash
python3 scripts/csv_to_json.py
```

Criterios de tratamiento preservados en el dashboard:
- `posting_year` y `posting_month` se conservan como enteros.
- `is_senior`, `is_remote_friendly` e `is_llm_role` se conservan como indicadores binarios `0`/`1`.
- Los 288 registros cuyo `annual_salary_usd` está fuera de `salary_min_usd`–`salary_max_usd` se mantienen sin alteración ni eliminación.

## Sprint 2 – Componentes e interfaces React

### Requisitos
- Node.js 18+ y npm.

### Ejecución en desarrollo

```bash
npm install
npm run dev
```

### Compilación de producción

```bash
npm run build
```

### Valores de referencia (1,500 registros sin filtros)
- Mediana salarial anual: **USD 180.000**
- Prima salarial promedio por IA: **10,9%**
- Índice de demanda promedio: **87,5/100**
- Roles especializados LLM (`is_llm_role = 1`): **21,8%**
