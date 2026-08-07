import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { getExercisePerformanceHistory, listComparableExercises } from "@/modules/history/service";

interface ComparePageProps {
  searchParams: Promise<{ exerciseId?: string }>;
}

function formatSessionDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

interface SetResultData {
  id: string;
  setNumber: number;
  reps: number | null;
  load: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
}

function formatSet(set: SetResultData): string {
  const parts: string[] = [];
  if (set.reps != null) parts.push(`${set.reps} rip.`);
  if (set.load != null) parts.push(`${set.load} kg`);
  if (set.durationSeconds != null) parts.push(`${set.durationSeconds} s`);
  if (set.distanceMeters != null) parts.push(`${set.distanceMeters} m`);
  return parts.length > 0 ? parts.join(" · ") : "Nessun dato registrato";
}

// Vista nuova, non derivata dai prototipi di riferimento (nessuno dei tre
// implementava un vero confronto tra occorrenze dello stesso esercizio).
// L'etichettatura "attuale"/"precedente" ricalca l'esempio di
// requirements.md, sezione 9.
export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { exerciseId } = await searchParams;
  const user = await requireCurrentUser();
  const exercises = await listComparableExercises(user.id);
  const occurrences = exerciseId ? await getExercisePerformanceHistory(user.id, exerciseId) : [];
  const selectedExercise = exercises.find((exercise) => exercise.id === exerciseId);

  return (
    <div>
      <Link href="/history" className="text-sm text-text-muted hover:text-text-primary">
        ← Storico
      </Link>

      <h1 className="mt-2 text-2xl font-bold text-text-primary">Confronto prestazioni</h1>

      {exercises.length === 0 ? (
        <p className="mt-6 text-text-secondary">
          Registra almeno una sessione con un esercizio per poterlo confrontare nel tempo.
        </p>
      ) : (
        <>
          <form action="/history/compare" className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-xs text-text-secondary">
              Esercizio
              <select
                name="exerciseId"
                defaultValue={exerciseId ?? ""}
                className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary"
              >
                <option value="" disabled>
                  Scegli un esercizio…
                </option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Confronta
            </button>
          </form>

          {exerciseId && selectedExercise && (
            <div className="mt-6">
              <h2 className="font-semibold text-text-primary">{selectedExercise.name}</h2>
              {occurrences.length === 0 ? (
                <p className="mt-2 text-text-secondary">Nessuna occorrenza trovata.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-4">
                  {occurrences.map((occurrence, index) => (
                    <li
                      key={occurrence.id}
                      className="rounded-2xl border border-border/40 bg-surface-alt px-5 py-4"
                    >
                      <p className="text-xs font-semibold uppercase text-text-muted">
                        {index === 0 ? "Prestazione attuale" : "Prestazione precedente"}
                      </p>
                      <p className="mt-1 font-semibold text-text-primary">
                        {occurrence.session.name} — {formatSessionDate(occurrence.session.startedAt)}
                      </p>
                      {occurrence.setResults.length === 0 ? (
                        <p className="mt-1 text-sm text-text-secondary">Nessuna serie registrata.</p>
                      ) : (
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-text-secondary">
                          {occurrence.setResults.map((set) => (
                            <li key={set.id}>
                              Serie {set.setNumber}: {formatSet(set)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
