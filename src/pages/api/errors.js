import comicsIndex from "../../../server/comics";
import auth from "../../../server/auth";

export default async (req, res) => {
  const user = await auth.authenticate(req, res);
  if (!user) {
    return;
  }

  res.json({
    errors: comicsIndex.errors
  });
};
