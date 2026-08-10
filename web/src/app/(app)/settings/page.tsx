import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/authActions";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Impostazioni</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-alt-2 text-sm font-bold text-primary">
          {initials}
        </span>
        <p className="flex-1 truncate text-text-secondary">{user?.email}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border-[1.5px] border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Esci
          </button>
        </form>
      </div>

      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
