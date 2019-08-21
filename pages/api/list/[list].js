import comicsIndex from "../../../server/comics";
import { fromUrl } from "../../../server/utils";
import { authenticate } from "../../../server/auth";
import db from "../../../server/db";

function allBooksInside(node, books) {
  books.push(node);
  if (node.children) {
    node.children.forEach(book => {
      allBooksInside(book, books);
    });
  }

  return books;
}

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
    books = node.children.map(currentBook => {
      const booksInside = allBooksInside(currentBook, []);

      return {
        ...currentBook.forClient(),
        read: isRead(readBooks, currentBook.getPath()),
        booksInsideRead: booksInside.filter(innerBook =>
          isRead(readBooks, innerBook.getPath())
        ).length,
        booksInside: booksInside.length
      };
    });
  }

  res.json({ dir, parent, books });
};
