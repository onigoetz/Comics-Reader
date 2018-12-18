const bcrypt = require("bcrypt");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const { getUserByName } = require("./db.js");
const cfg = require("../../config.js");

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};


const strategy = new Strategy(params, ((payload, done) => {
  let user;

  try {
    user = getUserByName(payload.username);
  } catch (e) {
    return done(e, null);
  }

  if (!user) {
    return done(new Error("User not found"), null);
  }

  return done(null, user);
}));
passport.use(strategy);

module.exports = {
  initialize() {
    return passport.initialize();
  },
  authenticate() {
    return (req, res, next) => {
      return passport.authenticate("jwt", {session: false}, (err, user, info) => {
        if (err) {
          console.error("Failed authentication", err);
          return res.status(400).json({error: "Failed"});
        }

        if (!user) {
          return res.status(401).json({error: "Failed authentication"});
        }

        req.user = user;

        return next();
      })(req, res, next);
    };
  },
  async checkPassword(username, password) {
    const user = getUserByName(username);

    if (!user) {
      throw new Error("User not found");
    }

    // Always use hashed passwords and fixed time comparison
    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) {
      return null;
    }

    return user;
  }
};