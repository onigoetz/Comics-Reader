const path = require("path");

const Database = require("better-sqlite3");

const config = require("../../config");

const db = new Database(path.join(config.comics, "comics.db"));

const DBVersion = 1;
const migrations = {
  1: () => {
    console.log("Creating 'read' table");

    db.prepare("CREATE TABLE read (user varchar(255), book TEXT)").run();
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

// START / INIT DB

// PUBLIC METHODS

function getRead(user) {
  return db
    .prepare("SELECT book FROM read WHERE user = @user")
    .all({ user })
    .map(row => row.book);
}

function markRead(user, book) {
  db
    .prepare("INSERT INTO read (user, book) VALUES (@user, @book)")
    .run({ user, book });

  return getRead(user);
}

module.exports = {
  getRead,
  markRead
};
