import comicsIndex from "../../server/comics";
import { authenticate } from "../../server/auth";

export default async (req, res) => {
  const user = await authenticate(req, res);
  if (!user) {
    return;
  }

  res.json({
    errors: comicsIndex.errors
  });
};
