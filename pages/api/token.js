/* global process */
import { checkPassword } from "../../server/auth";
import comicsIndex from "../../server/comics";

import jwt from "jwt-simple";

export default async (req, res) => {
  if (!comicsIndex.isReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.sendStatus(401);
    return;
  }

  try {
    await checkPassword(username, password);
  } catch (e) {
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
