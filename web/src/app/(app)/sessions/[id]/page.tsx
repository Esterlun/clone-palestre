import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { WorkoutNotFoundError } from "@/modules/workouts/errors";
import { listExercisesForUser } from "@/modules/workouts/exerciseService";
import { getSessionForUser } from "@/modules/workouts/sessionService";
import { deleteSessionAction, updateSessionDetailsAction } from "../actions";
import { AddExercisePanel } from "./AddExercisePanel";
import { CompleteSessionButton } from "./CompleteSessionButton";
import { DeleteSessionButton } from "./DeleteSessionButton";
import { SessionDetailsForm } from "./SessionDetailsForm";
import { SessionExercisePanel } from "./SessionExercisePanel";

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

  const exercises = await listExercisesForUser(user.id);
  const isCompleted = session.status === "COMPLETED";
  const boundUpdateDetailsAction = updateSessionDetailsAction.bind(null, session.id);
  const boundDeleteAction = deleteSessionAction.bind(null, session.id);

  return (
    <div>
      <Link href="/history" className="text-sm text-text-muted hover:text-text-primary">
        ← Storico
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{session.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">{isCompleted ? "Completata" : "In corso"}</p>
        </div>
        <div className="flex gap-2">
          {!isCompleted && <CompleteSessionButton sessionId={session.id} />}
          <DeleteSessionButton action={boundDeleteAction} sessionName={session.name} />
        </div>
      </div>

      <SessionDetailsForm
        action={boundUpdateDetailsAction}
        initialName={session.name}
        initialNotes={session.notes}
      />

      {session.sessionExercises.length === 0 ? (
        <p className="mt-6 text-text-secondary">Nessun esercizio aggiunto ancora.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {session.sessionExercises.map((sessionExercise) => (
            <SessionExercisePanel
              key={sessionExercise.id}
              sessionId={session.id}
              sessionExerciseId={sessionExercise.id}
              exerciseName={sessionExercise.exercise.name}
              tracksReps={sessionExercise.exercise.tracksReps}
              tracksLoad={sessionExercise.exercise.tracksLoad}
              tracksDuration={sessionExercise.exercise.tracksDuration}
              tracksDistance={sessionExercise.exercise.tracksDistance}
              initialSets={sessionExercise.setResults}
              plannedSets={sessionExercise.plannedSets}
              plannedReps={sessionExercise.plannedReps}
              targetLoad={sessionExercise.targetLoad}
            />
          ))}
        </ul>
      )}

      <div className="mt-6">
        <AddExercisePanel sessionId={session.id} exercises={exercises} />
      </div>
    </div>
  );
}
