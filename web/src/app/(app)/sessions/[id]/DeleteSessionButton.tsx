"use client";

export function DeleteSessionButton({
  action,
  sessionName,
}: {
  action: () => Promise<void>;
  sessionName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(`Eliminare la sessione "${sessionName}"? L'operazione non è reversibile.`)
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Elimina sessione
      </button>
    </form>
  );
}
