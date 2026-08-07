"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { InvalidCredentialsError } from "@/modules/identity/errors";
import { changePassword, deleteUserAccount } from "@/modules/identity/service";
import { SESSION_COOKIE_NAME } from "@/modules/identity/session";

export interface ChangePasswordFormState {
  error: string | null;
  success: boolean;
}

export async function changePasswordAction(
  _previousState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const user = await requireCurrentUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "La nuova password deve avere almeno 8 caratteri.", success: false };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Le due password non coincidono.", success: false };
  }

  try {
    await changePassword(user.id, { currentPassword, newPassword });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { error: "Password attuale non corretta.", success: false };
    }
    return { error: "Non è stato possibile cambiare la password. Riprova.", success: false };
  }

  return { error: null, success: true };
}

export interface DeleteAccountFormState {
  error: string | null;
}

export async function deleteAccountAction(
  _previousState: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  const user = await requireCurrentUser();
  const password = String(formData.get("password") ?? "");

  try {
    await deleteUserAccount(user.id, password);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { error: "Password non corretta." };
    }
    return { error: "Non è stato possibile eliminare l'account. Riprova." };
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
