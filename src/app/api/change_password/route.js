import { checkPassword } from "../../../../server/auth";
import comicsIndex from "../../../../server/comics";
import db from "../../../../server/db";
import { getValidSession } from "../../../auth";

export default async () => {
  if (!comicsIndex.isReady) {
    return new Response("Server Not Ready", { status: 503 });
  }

  const user = await getValidSession();

  const { current_password: currentPassword, password } = await request.json();

  if (!currentPassword || !password) {
    return new Response("", { status: 400 });
  }

  try {
    await checkPassword(user.user, currentPassword);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
    return new Response("", { status: 401 });
  }

  await db.changePassword(user.user, password);

  return Response.json({ success: true });
};
