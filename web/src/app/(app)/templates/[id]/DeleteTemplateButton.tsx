"use client";

export function DeleteTemplateButton({
  action,
  templateName,
}: {
  action: () => Promise<void>;
  templateName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Eliminare il modello "${templateName}"? Le sessioni già registrate non verranno toccate.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full bg-danger-surface px-4 py-2 text-sm font-semibold text-danger hover:bg-danger-surface/70"
      >
        Elimina modello
      </button>
    </form>
  );
}
