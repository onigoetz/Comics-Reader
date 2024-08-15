import path from "path";

import comicsIndex from "../../../../server/comics.js";
import { getValidSession } from "../../../auth";

async function getMatching(books, search) {
  const term = search.toLowerCase();

  const promises = Object.keys(books)
    .filter((item) => {
      return path.basename(item).toLowerCase().indexOf(term) !== -1;
    })
    .slice(0, 25)
    .map(async (item) => {
      const node = await comicsIndex.getNode(item);

      return {
        ...node.forClient(),
        parent: node.getParent() ? node.getParent().getPath() : null,
      };
    });

  return Promise.all(promises);
}

export async function POST(request) {
  await getValidSession();

  if (!comicsIndex.isReady) {
    return Response.json({ books: [] });
  }

  const body = await request.json();

  return Response.json({
    books: await getMatching(comicsIndex.walker.getBooks(), body.search),
  });
}
