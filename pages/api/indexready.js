import comicsIndex from "../../server/comics";

export default (req, res) => {
  res.json({ ready: comicsIndex.isReady });
};
