import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { WorkoutNotFoundError } from "@/modules/workouts/errors";
import { listExercisesForUser } from "@/modules/workouts/exerciseService";
import { getSessionForUser } from "@/modules/workouts/sessionService";
import { deleteSessionAction, updateSessionDetailsAction } from "../actions";
import { SessionRunner } from "./SessionRunner";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireCurrentUser();

  let session: Awaited<ReturnType<typeof getSessionForUser>>;
  try {
    session = await getSessionForUser(user.id, id);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      notFound();
    }
    throw error;
  }

  const isCompleted = session.status === "COMPLETED";

  if (isCompleted) {
    const allSets = session.sessionExercises.flatMap((sessionExercise) => sessionExercise.setResults);
    const completedSets = allSets.length;
    const totalVolume = allSets.reduce((total, set) => {
      if (set.reps == null || set.load == null) {
        return total;
      }
      return total + set.reps * set.load;
    }, 0);

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <span className="material-symbols-outlined text-[32px]">check</span>
        </span>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Allenamento salvato</h1>
        <p className="mt-1 text-text-secondary">{session.name}</p>
        <div className="mt-6 flex gap-8">
          <div>
            <p className="text-2xl font-bold text-text-primary">{completedSets}</p>
            <p className="text-xs text-text-muted">Serie completate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{totalVolume.toLocaleString("it-IT")} kg</p>
            <p className="text-xs text-text-muted">Volume totale</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-8 rounded-full bg-gradient-to-br from-primary-hover to-primary px-6 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-8px_rgba(83,64,228,0.7)]"
        >
          Torna alla dashboard
        </Link>
      </div>
    );
  }

  const exercises = await listExercisesForUser(user.id);
  const boundUpdateDetailsAction = updateSessionDetailsAction.bind(null, session.id);
  const boundDeleteAction = deleteSessionAction.bind(null, session.id);

  return (
    <SessionRunner
      sessionId={session.id}
      sessionName={session.name}
      sessionNotes={session.notes}
      sessionExercises={session.sessionExercises.map((sessionExercise) => ({
        id: sessionExercise.id,
        exerciseId: sessionExercise.exerciseId,
        exerciseName: sessionExercise.exercise.name,
        tracksReps: sessionExercise.exercise.tracksReps,
        tracksLoad: sessionExercise.exercise.tracksLoad,
        tracksDuration: sessionExercise.exercise.tracksDuration,
        tracksDistance: sessionExercise.exercise.tracksDistance,
        setResults: sessionExercise.setResults,
        plannedSets: sessionExercise.plannedSets,
        plannedReps: sessionExercise.plannedReps,
        targetLoad: sessionExercise.targetLoad,
      }))}
      exercises={exercises}
      detailsAction={boundUpdateDetailsAction}
      deleteAction={boundDeleteAction}
    />
  );
}
