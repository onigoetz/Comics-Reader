//@ts-check

const path = require("path");

const database = require("better-sqlite3");

const config = require("../config");

const db = database(path.join(config.comics, "comics.db"));

const DBVersion = 2;
const migrations = {
  1: () => {
    console.log("Creating 'read' table");

    db.prepare("CREATE TABLE read (user varchar(255), book TEXT)").run();
  },
  2: () => {
    console.log("Creating 'users' table");

    db.prepare(
      "CREATE TABLE users (user varchar(255), passwordHash varchar(255))"
    ).run();
  }
};

function getVersion() {
  return db.prepare("SELECT version FROM migrations").get().version;
}

function setVersion(version) {
  return db
    .prepare("UPDATE migrations SET version = @version")
    .run({ version });
}

function createMigrationTable() {
  console.log("Creating migration table");

  db.prepare("CREATE TABLE migrations (version int)").run();
  db.prepare("INSERT INTO migrations VALUES (@version)").run({ version: 0 });
}

function migrate(currentVersion) {
  console.log(
    "Applying migrations, your DB is at version",
    currentVersion,
    "going to",
    DBVersion
  );

  let newVersion = currentVersion + 1;
  while (newVersion <= DBVersion) {
    console.log("Applying migrations to version", newVersion);
    migrations[newVersion]();
    setVersion(newVersion);
    newVersion++;
  }
}

// Ensure DB is up to date

let version;

try {
  version = getVersion();
} catch (e) {
  // If we don't have a version, the DB wasn't created
  createMigrationTable();
  version = getVersion();
}

if (version !== DBVersion) {
  migrate(version);
  console.log("Your DB is up to date");
}

// PUBLIC METHODS

function getRead(user) {
  return db
    .prepare("SELECT book FROM read WHERE user = @user")
    .all({ user })
    .map(row => row.book);
}

function markRead(user, book) {
  db.prepare("INSERT INTO read (user, book) VALUES (@user, @book)").run({
    user,
    book
  });

  return getRead(user);
}

function getUserByName(user) {
  return db.prepare("SELECT * FROM users WHERE user = @user").get({ user });
}

function encodePassword(password) {
  return require("bcrypt").hash(password, 10);
}

async function createUser(user, password) {
  const passwordHash = await encodePassword(password);

  return db
    .prepare(
      "INSERT INTO users (user, passwordHash) VALUES (@user, @passwordHash)"
    )
    .run({ user, passwordHash });
}

async function changePassword(user, password) {
  const passwordHash = await encodePassword(password);

  return db
    .prepare("UPDATE users SET passwordHash = @passwordHash WHERE user = @user")
    .run({ user, passwordHash });
}

module.exports = {
  getRead,
  markRead,
  getUserByName,
  createUser,
  changePassword
};
