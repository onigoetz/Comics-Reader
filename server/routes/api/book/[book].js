import comicsIndex from "../../../comics.js";
import { getPages } from "../../../books/index.js";
import { fromUrl } from "../../../utils.js";
import auth from "../../../auth.js";
import { getRead } from "../../../db.js";

export default async (req, res) => {
  try {
    if (!comicsIndex.isReady) {
      res.status(503).send("Server Not Ready");
      return;
    }

    const user = await auth.authenticate(req, res);
    if (!user) {
      return;
    }

    const book = fromUrl(req.params.book || "");

    let node;
    try {
      node = await comicsIndex.getNode(book);
    } catch (e) {
      console.error(e);
      res.status(404).send("Book not found");
      return;
    }

    const pages = await getPages(book);

    const parent = node.parent ? node.parent.forClient() : null;

    const readBooks = getRead(user.user);
    const read = readBooks.indexOf(node.getPath()) !== -1;

    res.setHeader("Cache-Control", "no-cache");
    res.json({
      book: node.forClient(),
      parent,
      read,
      pages
    });
  } catch (e) {
    res.status(500).json({ error: "An error occured, please retry later" });

    console.error("ERROR", e);
  }
};
