import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/authActions";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Impostazioni</h1>
      <p className="mt-2 text-text-secondary">{user?.email}</p>

      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover"
        >
          Esci
        </button>
      </form>

      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
