"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerUser } from "@/modules/identity/service";
import { EmailAlreadyUsedError } from "@/modules/identity/errors";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/modules/identity/session";

export interface RegisterFormState {
  error: string | null;
}

export async function registerAction(
  _previousState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email e password sono obbligatorie." };
  }
  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  try {
    const user = await registerUser({ email, password });
    const token = await createSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
  } catch (error) {
    if (error instanceof EmailAlreadyUsedError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile creare l'account. Riprova." };
  }

  // redirect() deve restare fuori dal blocco try/catch: internamente lancia
  // un'eccezione speciale (NEXT_REDIRECT) che verrebbe altrimenti intercettata.
  redirect("/dashboard");
}
