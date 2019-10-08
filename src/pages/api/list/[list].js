import comicsIndex from "../../../../server/comics";
import { fromUrl } from "../../../../server/utils";
import { authenticate } from "../../../../server/auth";
import db from "../../../../server/db";

function isRead(readBooks, book) {
  return readBooks.indexOf(book) !== -1;
}

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const user = await authenticate(req, res);
  if (!user) {
    return;
  }

  const book = fromUrl(req.query.list || "");

  let node;
  try {
    node = await comicsIndex.getNode(book);
  } catch (e) {
    res.status(404).send("Book not found");
    return;
  }

  const readBooks = db.getRead(user.user);

  const dir = node.forClient();

  const parent = node.parent ? node.parent.forClient() : null;

  let books = [];
  if (node.children) {
    const allBooks = Object.keys(comicsIndex.walker.getBooks());

    books = node.children.map(currentNode => {
      const currentPath = currentNode.getPath();
      const search = `${currentPath}/`;
      const booksInside = allBooks.filter(item => item.indexOf(search) === 0);

      return {
        ...currentNode.forClient(),
        read: isRead(readBooks, currentPath),
        booksInsideRead: booksInside.filter(innerBook =>
          isRead(readBooks, innerBook)
        ).length,
        booksInside: booksInside.length
      };
    });
  }

  res.json({ dir, parent, books });
};
