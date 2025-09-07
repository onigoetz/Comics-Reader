import comicsIndex from "../../comics.js";

export default (req, res) => {
  res.json({
    ready: comicsIndex.isReady,
    books: comicsIndex.foundBooks,
    thumbs: comicsIndex.foundThumbs,
    phase: comicsIndex.phase
  });
};
