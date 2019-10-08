import comicsIndex from "../../../server/comics";

export default (req, res) => {
  res.json({
    ready: comicsIndex.isReady,
    books: comicsIndex.foundBooks,
    thumbs: comicsIndex.foundThumbs,
    phase: comicsIndex.phase
  });
};
