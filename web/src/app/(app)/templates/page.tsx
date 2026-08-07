import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { listWorkoutTemplates } from "@/modules/workouts/templateService";

export default async function TemplatesPage() {
  const user = await requireCurrentUser();
  const templates = await listWorkoutTemplates(user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Modelli di allenamento</h1>
        <Link
          href="/templates/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Nuovo modello
        </Link>
      </div>

      {templates.length === 0 ? (
        <p className="mt-6 text-text-secondary">Nessun modello da mostrare ancora.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {templates.map((template) => (
            <li key={template.id}>
              <Link
                href={`/templates/${template.id}`}
                className="block rounded-2xl border border-border/40 bg-surface-alt px-5 py-4 hover:border-primary/40"
              >
                <p className="font-semibold text-text-primary">{template.name}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {template.templateExercises.length}{" "}
                  {template.templateExercises.length === 1 ? "esercizio" : "esercizi"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
