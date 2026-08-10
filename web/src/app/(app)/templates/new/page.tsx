import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { listExercisesForUser } from "@/modules/workouts/exerciseService";
import { TemplateForm } from "../TemplateForm";
import { createTemplateAction } from "../actions";

export default async function NewTemplatePage() {
  const user = await requireCurrentUser();
  const exercises = await listExercisesForUser(user.id);

  return (
    <div>
      <Link href="/templates" className="text-sm text-text-muted hover:text-text-primary">
        ← Modelli
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-text-primary">Nuovo modello</h1>
      <TemplateForm action={createTemplateAction} exercises={exercises} submitLabel="Crea modello" />
    </div>
  );
}
