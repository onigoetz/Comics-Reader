import comicsIndex from "../../../../server/comics";
import { fromUrl } from "../../../../server/utils";
import db from "../../../../server/db";
import { getValidSession } from "../../../../auth";

export async function POST(request, { params }) {
  if (!comicsIndex.isReady) {
    return new Response("Server Not Ready", { status: 503 });
  }

  // TODO :: respond with JSON in case of invalid session
  await getValidSession();

  const book = fromUrl(params.read || "");
  db.markRead(user.user, book);

  return Response.json({}, { headers: { "Cache-Control": "no-cache" } });
}
