"use client";

import { useState } from "react";

interface MeasurementPoint {
  date: Date;
  weightKg: number | null;
  bodyFatPercentage: number | null;
  waistCm: number | null;
  chestCm: number | null;
  armsCm: number | null;
  thighsCm: number | null;
}

const METRIC_FIELDS = [
  { key: "weightKg", label: "Peso", unit: "kg", color: "#5340e4" },
  { key: "bodyFatPercentage", label: "Massa grassa", unit: "%", color: "#c55243" },
  { key: "waistCm", label: "Vita", unit: "cm", color: "#006a61" },
  { key: "chestCm", label: "Petto", unit: "cm", color: "#6d5dfe" },
  { key: "armsCm", label: "Braccia", unit: "cm", color: "#0aa89e" },
  { key: "thighsCm", label: "Cosce", unit: "cm", color: "#474555" },
] as const;

type MetricKey = (typeof METRIC_FIELDS)[number]["key"];

// Grafico generico per una qualunque delle 6 metriche, non solo peso e massa
// grassa: i prototipi di riferimento coprivano solo queste due, ma
// requirements.md sezione 7 chiede l'andamento per tutte le metriche
// registrabili.
export function MetricTrendChart({ measurements }: { measurements: MeasurementPoint[] }) {
  const availableFields = METRIC_FIELDS.filter((field) =>
    measurements.some((measurement) => measurement[field.key] != null)
  );
  const [activeKey, setActiveKey] = useState<MetricKey | null>(null);

  if (availableFields.length === 0) {
    return null;
  }

  const activeField = availableFields.find((field) => field.key === activeKey) ?? availableFields[0];

  const points = measurements
    .filter((measurement) => measurement[activeField.key] != null)
    .map((measurement) => ({ date: measurement.date, value: measurement[activeField.key] as number }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return (
    <div className="rounded-3xl border border-border/40 bg-surface-alt p-6">
      <h2 className="font-semibold text-text-primary">Andamento</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {availableFields.map((field) => (
          <button
            key={field.key}
            type="button"
            onClick={() => setActiveKey(field.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              field.key === activeField.key ? "bg-primary text-white" : "bg-surface-alt-2 text-text-secondary"
            }`}
          >
            {field.label}
          </button>
        ))}
      </div>

      {points.length < 2 ? (
        <p className="mt-6 text-sm text-text-secondary">
          Servono almeno due misurazioni con questo dato per vedere l&apos;andamento.
        </p>
      ) : (
        <div className="mt-6">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full overflow-visible">
            <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e0ee" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e0ee" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e0ee" strokeWidth="0.5" />
            <polyline
              fill="none"
              stroke={activeField.color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              points={points
                .map((point, index) => {
                  const x = (index / (points.length - 1)) * 100;
                  const y = 90 - ((point.value - min) / range) * 80;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
          <div className="mt-2 flex justify-between text-xs text-text-muted">
            <span>{points[0].date.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}</span>
            <span>
              {points[points.length - 1].date.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
            </span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Ultimo valore:{" "}
            <span className="font-semibold text-text-primary">
              {points[points.length - 1].value}
              {activeField.unit}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
