import comicsIndex from "../../../../server/comics";
import { fromUrl } from "../../../../server/utils";
import db from "../../../../server/db";
import { getThumbnailSize } from "../../../../server/api/imagecache";

import Layout from "../../../components/Layout";
import List from "../../../components/List";
import { getValidSession } from "../../../auth";

function isRead(readBooks, book) {
  return readBooks.indexOf(book) !== -1;
}

async function getList(list, user) {
  const book = fromUrl(list);

  let node;
  try {
    node = await comicsIndex.getNode(book);
  } catch (e) {
    //res.status(404).send("Book not found");
    return;
  }

  const readBooks = db.getRead(user.user);

  const dir = node.forClient();

  const parent = node.parent ? node.parent.forClient() : null;

  let books = [];
  if (node.children) {
    const allBooks = Object.keys(comicsIndex.walker.getBooks());

    books = await Promise.all(
      node.children.map(async (currentNode) => {
        const currentPath = currentNode.getPath();
        const search = `${currentPath}/`;
        const booksInside = allBooks.filter(
          (item) => item.indexOf(search) === 0
        );

        const nodeInfo = currentNode.forClient();

        let thumbWidth = 100;
        try {
          thumbWidth = (await getThumbnailSize(nodeInfo.thumb)).width;
        } catch (e) {
          /* eslint-disable-next-line no-console */
          console.error(
            "Failed calculating thumbnail width",
            nodeInfo.thumb,
            e.message
          );
        }

        return {
          ...nodeInfo,
          thumbWidth,
          read: isRead(readBooks, currentPath),
          booksInsideRead: booksInside.filter((innerBook) =>
            isRead(readBooks, innerBook)
          ).length,
          booksInside: booksInside.length,
        };
      })
    );
  }

  return { dir, parent, books };
}

export default async function Page({ params: { list } }) {
  /* const user = */await getValidSession();
  // TODO :: properly get user
  const user = { user: "sgoetz" };

  const path = list || "";
  const currentUrl = path ? `/list/${path}` : "";

  const data = await getList(decodeURIComponent(path), user);

  // TODO :: figure out how to detect this properly
  const isRetina = false;
  const supportsWebp = false;

  return (
    <Layout
      url={currentUrl}
      current={data ? data.dir : null}
      parent={data ? data.parent : null}
    >
      <List
        books={data.books}
        isRetina={isRetina}
        supportsWebp={supportsWebp}
      />
    </Layout>
  );
}
