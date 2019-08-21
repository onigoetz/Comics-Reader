import path from "path";

import comicsIndex from "../../server/comics";
import { authenticate } from "../../server/auth";

async function getMatching(books, search) {
  const term = search.toLowerCase();

  const promises = Object.keys(books)
    .filter(item => {
      return (
        path
          .basename(item)
          .toLowerCase()
          .indexOf(term) !== -1
      );
    })
    .slice(0, 25)
    .map(async item => {
      const node = await comicsIndex.getNode(item);

      return {
        ...node.forClient(),
        parent: node.getParent() ? node.getParent().getPath() : null
      };
    });

  return Promise.all(promises);
}

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.json({ books: [] });
    return;
  }

  const user = await authenticate(req, res);
  if (!user) {
    return;
  }

  res.json({
    books: await getMatching(comicsIndex.walker.getBooks(), req.body.search)
  });
};
