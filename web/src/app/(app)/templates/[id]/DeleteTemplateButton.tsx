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
        className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Elimina modello
      </button>
    </form>
  );
}
