"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { deleteMeasurementAction, updateMeasurementAction, type MeasurementFormState } from "./actions";
import { MeasurementFormFields } from "./MeasurementFormFields";

interface MeasurementData {
  id: string;
  date: Date;
  weightKg: number | null;
  bodyFatPercentage: number | null;
  waistCm: number | null;
  chestCm: number | null;
  armsCm: number | null;
  thighsCm: number | null;
}

const SUMMARY_FIELDS: { key: keyof MeasurementData; label: string; unit: string }[] = [
  { key: "weightKg", label: "Peso", unit: "kg" },
  { key: "bodyFatPercentage", label: "Massa grassa", unit: "%" },
  { key: "waistCm", label: "Vita", unit: "cm" },
  { key: "chestCm", label: "Petto", unit: "cm" },
  { key: "armsCm", label: "Braccia", unit: "cm" },
  { key: "thighsCm", label: "Cosce", unit: "cm" },
];

const initialState: MeasurementFormState = { error: null };

function formatDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function MeasurementRow({ measurement }: { measurement: MeasurementData }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const boundUpdateAction = updateMeasurementAction.bind(null, measurement.id);
  const [state, formAction, isPending] = useActionState(boundUpdateAction, initialState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      setIsEditing(false);
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleDelete() {
    if (!window.confirm("Eliminare questa misurazione?")) {
      return;
    }
    setDeleteError(null);
    startDeleteTransition(async () => {
      try {
        await deleteMeasurementAction(measurement.id);
        router.refresh();
      } catch {
        setDeleteError("Non è stato possibile eliminare la misurazione. Riprova.");
      }
    });
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl bg-white p-4">
        <form action={formAction} className="flex flex-col gap-3">
          <MeasurementFormFields
            defaults={{
              date: toDateInputValue(measurement.date),
              weightKg: measurement.weightKg,
              bodyFatPercentage: measurement.bodyFatPercentage,
              waistCm: measurement.waistCm,
              chestCm: measurement.chestCm,
              armsCm: measurement.armsCm,
              thighsCm: measurement.thighsCm,
            }}
          />
          {state.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {isPending ? "Salvataggio…" : "Salva"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary"
            >
              Annulla
            </button>
          </div>
        </form>
      </li>
    );
  }

  const recordedFields = SUMMARY_FIELDS.filter((field) => measurement[field.key] != null);

  return (
    <li className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
        <div>
          <p className="font-semibold text-text-primary">{formatDate(measurement.date)}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {recordedFields.length === 0
              ? "Nessun dato registrato"
              : recordedFields
                  .map((field) => `${field.label}: ${measurement[field.key]}${field.unit}`)
                  .join(" · ")}
          </p>
          {deleteError && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {deleteError}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          Modifica
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm font-medium text-text-muted hover:text-red-600"
        >
          Elimina
        </button>
      </div>
    </li>
  );
}
