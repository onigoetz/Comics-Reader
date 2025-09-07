import auth from "../../auth.js";
import comicsIndex from "../../comics.js";
import { changePassword } from "../../db.js";

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const user = await auth.authenticate(req, res);
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
    await auth.checkPassword(user.user, currentPassword);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
    res.sendStatus(401);
    return;
  }

  await changePassword(user.user, password);

  res.json({ success: true });
};
