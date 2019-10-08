import { authenticate } from "../../../../server/auth";
import comicsIndex from "../../../../server/comics";
import { fromUrl } from "../../../../server/utils";
import db from "../../../../server/db";

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const user = await authenticate(req, res);
  if (!user) {
    return;
  }

  const book = fromUrl(req.query.read || "");
  db.markRead(user.user, book);

  res.setHeader("Cache-Control", "no-cache");
  res.json({});
};
