import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { WorkoutNotFoundError } from "@/modules/workouts/errors";
import { listExercisesForUser } from "@/modules/workouts/exerciseService";
import { getWorkoutTemplateForUser } from "@/modules/workouts/templateService";
import { TemplateForm } from "../TemplateForm";
import { deleteTemplateAction, duplicateTemplateAction, updateTemplateAction } from "../actions";
import { startSessionFromTemplateAction } from "../../sessions/actions";
import { DeleteTemplateButton } from "./DeleteTemplateButton";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireCurrentUser();

  let template: Awaited<ReturnType<typeof getWorkoutTemplateForUser>>;
  try {
    template = await getWorkoutTemplateForUser(user.id, id);
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      notFound();
    }
    throw error;
  }

  const exercises = await listExercisesForUser(user.id);
  const boundUpdateAction = updateTemplateAction.bind(null, template.id);
  const boundDeleteAction = deleteTemplateAction.bind(null, template.id);
  const boundDuplicateAction = duplicateTemplateAction.bind(null, template.id);
  const boundStartSessionAction = startSessionFromTemplateAction.bind(null, template.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{template.name}</h1>
        <div className="flex gap-2">
          <form action={boundStartSessionAction}>
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Avvia sessione
            </button>
          </form>
          <form action={boundDuplicateAction}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-alt-2"
            >
              Duplica
            </button>
          </form>
          <DeleteTemplateButton action={boundDeleteAction} templateName={template.name} />
        </div>
      </div>

      <TemplateForm
        action={boundUpdateAction}
        exercises={exercises}
        initialName={template.name}
        initialNotes={template.notes}
        initialExercises={template.templateExercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          plannedSets: exercise.plannedSets,
          plannedReps: exercise.plannedReps,
          targetLoad: exercise.targetLoad,
          notes: exercise.notes,
        }))}
        submitLabel="Salva modifiche"
      />
    </div>
  );
}
