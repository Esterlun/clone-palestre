import { getCurrentUser } from "@/lib/auth";
import { startFreeSessionAction } from "../sessions/actions";

// Contenuto placeholder: la dashboard reale (riepilogo modelli recenti,
// ultima sessione, andamento metriche) sarà costruita nei passi successivi
// del piano di integrazione, quando le rispettive sezioni saranno pronte.
export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Ciao, {user?.email}</h1>
      <p className="mt-2 text-text-secondary">
        Qui troverai presto un riepilogo dei tuoi allenamenti recenti e dei tuoi progressi.
      </p>

      <form action={startFreeSessionAction} className="mt-6">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover"
        >
          Nuova sessione libera
        </button>
      </form>
    </div>
  );
}
