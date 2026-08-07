"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser } from "@/modules/identity/service";
import { InvalidCredentialsError } from "@/modules/identity/errors";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/modules/identity/session";

export interface LoginFormState {
  error: string | null;
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email e password sono obbligatorie." };
  }

  try {
    const user = await authenticateUser({ email, password });
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
    if (error instanceof InvalidCredentialsError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile accedere. Riprova." };
  }

  redirect("/dashboard");
}
