import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { listSessionHistory } from "@/modules/history/service";

function parseDateParam(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatSessionDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

interface HistoryPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

// Sola lettura: lo storico organizza e presenta le sessioni, ma non le
// modifica mai direttamente. Il dettaglio riusa /sessions/[id], la stessa
// pagina della Gestione allenamenti, cosi che un'eventuale correzione passi
// sempre dal modulo proprietario (boundaries.md).
export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const { from, to } = await searchParams;
  const user = await requireCurrentUser();
  const sessions = await listSessionHistory(user.id, {
    fromDate: parseDateParam(from),
    toDate: parseDateParam(to),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Storico</h1>
        <Link href="/history/compare" className="text-sm font-medium text-primary hover:text-primary-hover">
          Confronta un esercizio
        </Link>
      </div>

      <form action="/history" className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4">
        <label className="text-xs text-text-secondary">
          Da
          <input
            type="date"
            name="from"
            defaultValue={from ?? ""}
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary"
          />
        </label>
        <label className="text-xs text-text-secondary">
          A
          <input
            type="date"
            name="to"
            defaultValue={to ?? ""}
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-gradient-to-br from-primary-hover to-primary px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(83,64,228,0.6)]"
        >
          Filtra
        </button>
        {(from || to) && (
          <Link href="/history" className="text-sm text-text-muted hover:text-text-primary">
            Azzera filtro
          </Link>
        )}
      </form>

      {sessions.length === 0 ? (
        <p className="mt-6 text-text-secondary">
          {from || to ? "Nessuna sessione nel periodo selezionato." : "Nessuna sessione registrata ancora."}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link
                href={`/sessions/${session.id}`}
                className="block rounded-2xl bg-white px-5 py-4 hover:bg-surface-alt-2/60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-bold text-text-primary">{session.name}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      session.status === "COMPLETED"
                        ? "bg-success/10 text-success"
                        : "bg-amber-border/14 text-amber"
                    }`}
                  >
                    {session.status === "COMPLETED" ? "Completata" : "In corso"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {formatSessionDate(session.startedAt)} ·{" "}
                  {session.sessionExercises.length}{" "}
                  {session.sessionExercises.length === 1 ? "esercizio" : "esercizi"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
