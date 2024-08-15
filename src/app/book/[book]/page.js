import comicsIndex from "../../../../server/comics";
import { getPages } from "../../../../server/books";
import { fromUrl } from "../../../../server/utils";

import db from "../../../../server/db";

import Layout from "../../../components/Layout";
import Book from "../../../components/Book";
import { getValidSession } from "../../../auth";

async function getBook(bookPath, user) {
  const book = fromUrl(bookPath);

  let node;
  try {
    node = await comicsIndex.getNode(book);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
    //res.status(404).send("Book not found");
    return;
  }

  const pages = await getPages(book);

  const parent = node.parent ? node.parent.forClient() : null;

  const readBooks = db.getRead(user.user);
  const read = readBooks.indexOf(node.getPath()) !== -1;

  //res.setHeader("Cache-Control", "no-cache");
  return {
    book: node.forClient(),
    parent,
    read,
    pages,
  };
}

export default async function Page({ params: { book } }) {
  /* const user = */ await getValidSession();
  // TODO :: properly get user
  const user = { user: "sgoetz" };

  const path = book || "";
  const currentUrl = path ? `/book/${path}` : "";

  const data = await getBook(decodeURIComponent(path), user);

  // TODO :: figure out how to detect this properly
  const isRetina = false;
  const supportsWebp = false;

  return (
    <Layout
      url={currentUrl}
      current={data ? data.dir : null}
      parent={data ? data.parent : null}
    >
      <div className="Content Content--gallery">
        <Book
          isRetina={isRetina}
          supportsWebp={supportsWebp}
          pages={data.pages}
          read={data.read}
          onRead={async () => {
            "use server";
            // TODO :: make it a server action
            // `read/${urlizeNode(book)}`
            markRead(token, path).then(() => {
              setRead(true);
            });
          }}
        />
      </div>
    </Layout>
  );
}
