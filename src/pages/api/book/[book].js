/* global process */
import comicsIndex from "../../../../server/comics";
import { getPages } from "../../../../server/books";
import { fromUrl } from "../../../../server/utils";
import { authenticate } from "../../../../server/auth";
import db from "../../../../server/db";

export default async (req, res) => {
  try {
    if (!comicsIndex.isReady) {
      res.status(503).send("Server Not Ready");
      return;
    }

    const user = await authenticate(req, res);
    if (!user) {
      return;
    }

    const book = fromUrl(req.query.book || "");

    let node;
    try {
      node = await comicsIndex.getNode(book);
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
      res.status(404).send("Book not found");
      return;
    }

    const pages = await getPages(book);

    const parent = node.parent ? node.parent.forClient() : null;

    const readBooks = db.getRead(user.user);
    const read = readBooks.indexOf(node.getPath()) !== -1;

    res.setHeader("Cache-Control", "no-cache");
    res.json({
      book: node.forClient(),
      parent,
      read,
      pages
    });
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error("ERROR", e);
  }
};
