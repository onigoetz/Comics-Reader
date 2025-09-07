/* global process */
import auth from "../../auth.js";

import jwt from "jwt-simple";

export default async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.sendStatus(401);
    return;
  }

  try {
    await auth.checkPassword(username, password);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error(e);
    res.sendStatus(401);
    return;
  }

  const payload = {
    username
  };

  const token = jwt.encode(payload, process.env.JWT_SECRET);

  res.json({
    token
  });
};
