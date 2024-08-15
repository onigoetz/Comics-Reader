/* global process */
import { checkPassword } from "../../../server/auth";

import jwt from "jwt-simple";

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response("", { status: 401 });
  }

  try {
    await checkPassword(username, password);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
    return new Response("", { status: 401 });
  }

  const payload = {
    username,
  };

  const token = jwt.encode(payload, process.env.JWT_SECRET);

  return Response.json({
    token,
  });
}
