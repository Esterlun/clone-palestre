interface MeasurementDefaults {
  date?: string;
  weightKg?: number | null;
  bodyFatPercentage?: number | null;
  waistCm?: number | null;
  chestCm?: number | null;
  armsCm?: number | null;
  thighsCm?: number | null;
}

// Tutti i campi tranne la data sono facoltativi (requirements.md, sezione 7:
// "Tutte le metriche sono facoltative"). Componente puramente presentazionale,
// riusato sia dal form di aggiunta sia dalla modifica inline di una riga.
const fieldClassName =
  "mt-1 w-full rounded-[12px] border-[1.5px] border-border px-2.5 py-2 text-text-primary";

export function MeasurementFormFields({ defaults }: { defaults?: MeasurementDefaults }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <label className="col-span-2 text-xs font-medium text-text-secondary sm:col-span-1">
        Data
        <input type="date" name="date" required defaultValue={defaults?.date} className={fieldClassName} />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Peso (kg)
        <input
          type="number"
          step="0.1"
          min={0}
          name="weightKg"
          defaultValue={defaults?.weightKg ?? ""}
          className={fieldClassName}
        />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Massa grassa (%)
        <input
          type="number"
          step="0.1"
          min={0}
          max={100}
          name="bodyFatPercentage"
          defaultValue={defaults?.bodyFatPercentage ?? ""}
          className={fieldClassName}
        />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Vita (cm)
        <input
          type="number"
          step="0.1"
          min={0}
          name="waistCm"
          defaultValue={defaults?.waistCm ?? ""}
          className={fieldClassName}
        />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Petto (cm)
        <input
          type="number"
          step="0.1"
          min={0}
          name="chestCm"
          defaultValue={defaults?.chestCm ?? ""}
          className={fieldClassName}
        />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Braccia (cm)
        <input
          type="number"
          step="0.1"
          min={0}
          name="armsCm"
          defaultValue={defaults?.armsCm ?? ""}
          className={fieldClassName}
        />
      </label>
      <label className="text-xs font-medium text-text-secondary">
        Cosce (cm)
        <input
          type="number"
          step="0.1"
          min={0}
          name="thighsCm"
          defaultValue={defaults?.thighsCm ?? ""}
          className={fieldClassName}
        />
      </label>
    </div>
  );
}
