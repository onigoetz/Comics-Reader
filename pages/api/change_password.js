import { authenticate, checkPassword } from "../../server/auth";
import comicsIndex from "../../server/comics";
import db from "../../server/db";

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const user = await authenticate(req, res);
  if (!user) {
    return;
  }

  const currentPassword = req.body.current_password;
  const password = req.body.password;

  if (!currentPassword || !password) {
    res.sendStatus(400);
    return;
  }

  try {
    await checkPassword(user.user, currentPassword);
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
    return;
  }

  await db.changePassword(user.user, password);

  res.json({ success: true });
};
