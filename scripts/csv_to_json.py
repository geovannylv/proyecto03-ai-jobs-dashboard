import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "ai_jobs_market_2025_2026.csv"
JSON_PATH = ROOT / "data" / "ai_jobs_market_2025_2026.json"

INTEGER_FIELDS = {
    "years_of_experience",
    "salary_min_usd",
    "salary_max_usd",
    "demand_score",
    "posting_year",
    "posting_month",
    "is_senior",
    "is_remote_friendly",
    "is_llm_role",
}

FLOAT_FIELDS = {
    "annual_salary_usd",
    "ai_salary_premium_pct",
    "demand_growth_yoy_pct",
    "benefits_score_10",
}

TEXT_FIELDS = {
    "job_id",
    "job_title",
    "job_category",
    "experience_level",
    "education_required",
    "city",
    "country",
    "remote_work",
    "company_size",
    "industry",
    "required_skills",
    "salary_tier",
}


def convert_value(field, value):
    value = value.strip()

    if value == "":
        return None
    if field in INTEGER_FIELDS:
        return int(value)
    if field in FLOAT_FIELDS:
        return float(value)
    if field in TEXT_FIELDS:
        return value
    raise ValueError(f"Campo no clasificado: {field}")


def main():
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        rows = [
            {field: convert_value(field, value) for field, value in row.items()}
            for row in reader
        ]

    # Validaciones estructurales y de dominio.
    if not rows:
        raise ValueError("El CSV no contiene registros.")

    required_fields = INTEGER_FIELDS | FLOAT_FIELDS | TEXT_FIELDS
    if set(rows[0].keys()) != required_fields:
        raise ValueError("Las columnas del CSV no coinciden con las esperadas.")

    ids = [row["job_id"] for row in rows]
    if any(value is None for value in ids) or len(ids) != len(set(ids)):
        raise ValueError("Hay identificadores vacíos o duplicados.")

    invalid_months = [
        row["job_id"] for row in rows
        if row["posting_month"] is not None
        and not 1 <= row["posting_month"] <= 12
    ]
    if invalid_months:
        raise ValueError(f"Meses inválidos en registros: {invalid_months[:10]}")

    # Los indicadores binarios se conservan como enteros 0/1 del CSV original.
    for field in ("is_senior", "is_remote_friendly", "is_llm_role"):
        invalid = [row["job_id"] for row in rows if row[field] not in (0, 1)]
        if invalid:
            raise ValueError(f"Valores distintos de 0/1 en {field}: {invalid[:10]}")

    # No se descartan ni modifican salarios fuera del rango min/max:
    # se contabilizan para que la inconsistencia sea visible y trazable.
    out_of_range = sum(
        row["annual_salary_usd"] is not None
        and (
            row["annual_salary_usd"] < row["salary_min_usd"]
            or row["annual_salary_usd"] > row["salary_max_usd"]
        )
        for row in rows
    )

    with JSON_PATH.open("w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2, allow_nan=False)

    # Reabrir el JSON para validar que sea JSON válido y conservar el conteo.
    with JSON_PATH.open("r", encoding="utf-8") as file:
        validated = json.load(file)

    if len(validated) != len(rows):
        raise ValueError("La cantidad de registros cambió durante la conversión.")

    print("Transformación completada.")
    print(f"Registros CSV: {len(rows)}")
    print(f"Registros JSON: {len(validated)}")
    print(f"Salarios fuera del rango min/max (conservados): {out_of_range}")
    print(f"Archivo generado: {JSON_PATH}")


if __name__ == "__main__":
    main()
