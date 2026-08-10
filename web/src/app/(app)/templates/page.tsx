import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { listWorkoutTemplates } from "@/modules/workouts/templateService";
import { startSessionFromTemplateAction } from "../sessions/actions";

export default async function TemplatesPage() {
  const user = await requireCurrentUser();
  const templates = await listWorkoutTemplates(user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Modelli di allenamento</h1>
        <Link
          href="/templates/new"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-hover to-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(83,64,228,0.6)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nuovo modello
        </Link>
      </div>

      {templates.length === 0 ? (
        <p className="mt-6 text-text-secondary">Nessun modello da mostrare ancora.</p>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {templates.map((template) => {
            const exerciseNames = template.templateExercises
              .slice(0, 3)
              .map((templateExercise) => templateExercise.exercise.name);
            const boundStartSessionAction = startSessionFromTemplateAction.bind(null, template.id);

            return (
              <div key={template.id} className="rounded-[20px] bg-white p-4">
                <Link href={`/templates/${template.id}`} className="block">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                    <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                    {template.templateExercises.length}{" "}
                    {template.templateExercises.length === 1 ? "esercizio" : "esercizi"}
                  </span>
                  <p className="mt-2 text-[17px] font-bold text-text-primary">{template.name}</p>
                  {exerciseNames.length > 0 && (
                    <p className="mt-1 text-[12.5px] text-text-muted">{exerciseNames.join(" · ")}</p>
                  )}
                </Link>
                <form action={boundStartSessionAction} className="mt-3">
                  <button
                    type="submit"
                    className="w-full rounded-full border-[1.5px] border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                  >
                    Inizia allenamento
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
