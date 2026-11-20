# Sprint 1 – Transformación CSV a JSON

## Dataset
`data/ai_jobs_market_2025_2026.csv` es el CSV original seleccionado para el Sprint 1.

## Estructura
- `data/ai_jobs_market_2025_2026.csv`: dataset original.
- `data/ai_jobs_market_2025_2026.json`: registros convertidos a JSON.
- `scripts/csv_to_json.py`: script reproducible de transformación y validación.

## Requisitos
Python 3 instalado. El script utiliza únicamente la biblioteca estándar de Python; no requiere instalar paquetes externos.

## Ejecutar
Desde la carpeta raíz de este entregable:

```bash
python3 scripts/csv_to_json.py
```

El script lee el CSV, elimina espacios al inicio/final de los valores de texto, convierte los campos numéricos a `int` o `float`, conserva los campos categóricos como cadenas y convierte campos vacíos en `null`. Después valida las columnas, identificadores, meses, indicadores binarios, cantidad de registros y vuelve a abrir el JSON para comprobar que sea válido.

## Criterios de tratamiento
- `posting_year` y `posting_month` se conservan como enteros. El dataset no proporciona día ni fecha completa, por lo que no se inventa una fecha.
- `is_senior`, `is_remote_friendly` e `is_llm_role` se conservan como enteros `0`/`1`, tal como aparecen en el CSV.
- Los registros cuyo `annual_salary_usd` está fuera de `salary_min_usd` y `salary_max_usd` se conservan sin modificación. El script informa cuántos casos existen para no alterar silenciosamente el dataset.
- Los valores vacíos se representarían como `null`; en el archivo fuente inspeccionado no se encontraron valores vacíos.

## Resultado de la inspección del archivo fuente
- 1,500 registros y 25 columnas.
- 0 valores faltantes detectados.
- 0 identificadores duplicados.
- 0 espacios al inicio o al final de los campos de texto.
- 0 meses fuera del rango 1–12.
- 288 registros con salario anual fuera del rango min/max; se conservan y se reportan, sin corregirlos automáticamente.

## Ejemplo de estructura JSON
El JSON es un arreglo de objetos. Cada objeto representa un registro del CSV y conserva los nombres de sus 25 columnas.
