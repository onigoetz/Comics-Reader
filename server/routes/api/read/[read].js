import auth from "../../../auth.js";
import comicsIndex from "../../../comics.js";
import { fromUrl } from "../../../utils.js";
import { markRead } from "../../../db.js";

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const user = await auth.authenticate(req, res);
  if (!user) {
    res.setHeader("Cache-Control", "no-cache");
    res.json({});
    return;
  }

  const book = fromUrl(req.params.read || "");
  markRead(user.user, book);

  res.setHeader("Cache-Control", "no-cache");
  res.json({});
};
