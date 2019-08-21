const auth = require("basic-auth");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");

const { getUserByName } = require("./db.js");

async function findUser(payload) {
  const user = getUserByName(payload.username);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

const bearerRegex = /(\S+)\s+(\S+)/;
function fromAuthHeaderAsBearerToken(authorization) {
  const authScheme = "bearer";

  if (!authorization) {
    return null;
  }

  const matches = authorization.match(bearerRegex);
  if (!matches || matches[1].toLowerCase() !== authScheme) {
    return null;
  }

  return matches[2];
}

class DBAuth {
  async authenticate(req, res) {
    if (!("authorization" in req.headers)) {
      res.status(401).send("Authorization header missing");
      return false;
    }

    const token = fromAuthHeaderAsBearerToken(req.headers.authorization);

    const payload = jwt.decode(token, process.env.JWT_SECRET);

    try {
      return await findUser(payload);
    } catch (err) {
      console.error("Failed authentication", err);
      return res.status(400).json({ error: "Failed" });
    }
  }

  async checkPassword(username, password) {
    const user = getUserByName(username);

    if (!user) {
      throw new Error("User not found");
    }

    // Always use hashed passwords and fixed time comparison
    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      throw new Error("Passwords don't match");
    }

    return user;
  }
}

class BasicAuth {
  async authenticate(req, res) {
    // Basic auth is checked by Apache / Nginx, here we only use the username

    const authentication = auth(req);
    return authentication ? authentication.name : "anonymous";
  }

  async checkPassword(username, password) {
    throw new Error("This method isn't used in basic auth");
  }
}

const authMode = process.env.AUTH_MODE;

module.exports = authMode === "db" ? new DBAuth() : new BasicAuth();
