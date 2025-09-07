import comicsIndex from "../../comics.js";
import auth from "../../auth.js";

export default async (req, res) => {
  const user = await auth.authenticate(req, res);
  if (!user) {
    return;
  }

  res.json({
    errors: comicsIndex.errors
  });
};
