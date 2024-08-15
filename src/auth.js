import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = "comics_token";

export async function getAuthMode() {
  return process.env.AUTH_MODE;
}

export async function getValidSession() {
  const authMode = await getAuthMode();

  if (authMode === "db") {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);

    // We're logged out when the password change is applied
    if (!token) {
      redirect("/login");
    }
  }

  // TODO :: actually check authentication here


  // TODO :: return user
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
