import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppShell } from "@/components/nav/AppShell";

// Guscio comune a tutte le sezioni autenticate (dashboard, modelli, storico,
// metriche, impostazioni): verifica l'accesso una sola volta qui invece che
// in ogni singola pagina, come richiesto da boundaries.md ("ogni operazione
// deve essere collegata all'utente autenticato").
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
