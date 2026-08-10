import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listBodyMeasurements } from "@/modules/metrics/service";
import { listWorkoutTemplates } from "@/modules/workouts/templateService";
import { listSessionsForUser } from "@/modules/workouts/sessionService";
import { startFreeSessionAction } from "../sessions/actions";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = (day + 6) % 7; // lunedì = 0
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() - diff);
  return monday;
}

function sessionVolume(session: Awaited<ReturnType<typeof listSessionsForUser>>[number]): number {
  return session.sessionExercises.reduce((total, sessionExercise) => {
    return (
      total +
      sessionExercise.setResults.reduce((setTotal, set) => {
        if (set.reps == null || set.load == null) {
          return setTotal;
        }
        return setTotal + set.reps * set.load;
      }, 0)
    );
  }, 0);
}

function formatSessionDate(date: Date): string {
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const [templates, sessions, measurements] = await Promise.all([
    listWorkoutTemplates(user.id),
    listSessionsForUser(user.id),
    listBodyMeasurements(user.id),
  ]);

  const completedSessionsCount = sessions.filter((session) => session.status === "COMPLETED").length;

  const weighIns = measurements
    .filter((measurement) => measurement.weightKg != null)
    .map((measurement) => measurement.weightKg as number);
  const lastWeight = weighIns[0] ?? null;
  const previousWeight = weighIns[1] ?? null;
  const weightDelta = lastWeight != null && previousWeight != null ? lastWeight - previousWeight : null;

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + index);
    return day;
  });
  const todayKey = startOfDay(new Date()).getTime();

  const dailyVolume = weekDays.map((day, index) => {
    const dayKey = day.getTime();
    const nextDayKey = dayKey + 24 * 60 * 60 * 1000;
    const volume = sessions
      .filter((session) => {
        const startedAt = session.startedAt.getTime();
        return startedAt >= dayKey && startedAt < nextDayKey;
      })
      .reduce((total, session) => total + sessionVolume(session), 0);
    return { day, volume, isToday: dayKey === todayKey, label: WEEKDAY_LABELS[index] };
  });

  const weeklyVolume = dailyVolume.reduce((total, entry) => total + entry.volume, 0);
  const maxDailyVolume = Math.max(...dailyVolume.map((entry) => entry.volume), 1);

  const recentTemplates = templates.slice(0, 4);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Bentornato</p>
        <h1 className="mt-1 text-2xl font-bold text-text-primary">Ciao, {user.email.split("@")[0]}</h1>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-dark-card p-[30px] text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary/35 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent/18 blur-[60px]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Pronto quando vuoi
          </span>
          <h2 className="mt-4 max-w-xs text-[27px] font-extrabold leading-tight">
            Il tuo prossimo allenamento ti aspetta
          </h2>
          <form action={startFreeSessionAction} className="mt-6">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-br from-primary-hover to-primary px-5 py-3 text-[14.5px] font-bold text-white shadow-[0_12px_26px_-8px_rgba(109,93,254,0.7)]"
            >
              Nuova sessione libera
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
        <div className="rounded-[20px] border border-[rgba(200,196,216,0.4)] bg-white p-4">
          <p className="text-xs font-semibold text-text-muted">Ultimo peso</p>
          <p className="mt-1 text-[28px] font-bold text-text-primary">
            {lastWeight != null ? `${lastWeight}` : "—"}
            <span className="text-sm font-semibold text-text-muted"> kg</span>
          </p>
          {weightDelta != null && (
            <p className={`mt-1 text-xs font-semibold ${weightDelta <= 0 ? "text-success" : "text-coral"}`}>
              {weightDelta > 0 ? "+" : ""}
              {weightDelta.toFixed(1)} kg
            </p>
          )}
        </div>

        <div className="rounded-[20px] border border-teal-strong/22 bg-teal-surface p-4">
          <p className="text-xs font-semibold text-teal-surface-text">Sessioni completate</p>
          <p className="mt-1 text-[28px] font-bold text-teal-surface-text-strong">{completedSessionsCount}</p>
        </div>

        <div className="rounded-[20px] border border-amber-border/22 bg-amber-surface p-4">
          <p className="text-xs font-semibold text-amber">Volume settimanale</p>
          <p className="mt-1 text-[28px] font-bold text-amber">
            {weeklyVolume.toLocaleString("it-IT")}
            <span className="text-sm font-semibold"> kg</span>
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">I tuoi modelli</h2>
          <Link href="/templates" className="text-sm font-medium text-primary hover:text-primary-hover">
            Vedi tutti
          </Link>
        </div>
        {recentTemplates.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">Nessun modello creato ancora.</p>
        ) : (
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {recentTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="rounded-[20px] border border-[rgba(200,196,216,0.4)] bg-white p-4 hover:border-primary/40"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">fitness_center</span>
                <p className="mt-2 font-bold text-text-primary">{template.name}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {template.templateExercises.length}{" "}
                  {template.templateExercises.length === 1 ? "esercizio" : "esercizi"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-text-primary">Ultimi allenamenti</h2>
        {recentSessions.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">Nessun allenamento registrato ancora.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {recentSessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/sessions/${session.id}`}
                  className="flex items-center justify-between rounded-2xl border border-[rgba(200,196,216,0.4)] bg-white px-5 py-4 hover:border-primary/40"
                >
                  <div>
                    <p className="font-semibold text-text-primary">{session.name}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">{formatSessionDate(session.startedAt)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      session.status === "COMPLETED"
                        ? "bg-success/10 text-success"
                        : "bg-amber-border/14 text-amber"
                    }`}
                  >
                    {session.status === "COMPLETED" ? "Completata" : "In corso"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[24px] bg-surface-alt p-6">
        <h2 className="font-semibold text-text-primary">Volume settimanale</h2>
        <div className="mt-4 flex h-32 items-end gap-2">
          {dailyVolume.map((entry) => (
            <div key={entry.day.toISOString()} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-t-lg ${entry.isToday ? "bg-accent" : "bg-violet-light"}`}
                style={{ height: `${Math.max((entry.volume / maxDailyVolume) * 100, entry.volume > 0 ? 6 : 2)}%` }}
              />
              <span className="text-[11px] font-medium text-text-muted">{entry.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
