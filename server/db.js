//@ts-check

import path from "node:path";
import bcrypt from "bcrypt";

import database from "better-sqlite3";

const db = database(path.join(process.env.DIR_COMICS, "comics.db"));

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
  // eslint-disable-next-line no-unused-vars
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

export function getRead(user) {
  return db
    .prepare("SELECT book FROM read WHERE user = @user")
    .all({ user })
    .map(row => row.book);
}

export function markRead(user, book) {
  db.prepare("INSERT INTO read (user, book) VALUES (@user, @book)").run({
    user,
    book
  });

  return getRead(user);
}

export function getUserByName(user) {
  return db.prepare("SELECT * FROM users WHERE user = @user").get({ user });
}

function encodePassword(password) {
  return bcrypt.hash(password, 10);
}

export async function createUser(user, password) {
  const passwordHash = await encodePassword(password);

  return db
    .prepare(
      "INSERT INTO users (user, passwordHash) VALUES (@user, @passwordHash)"
    )
    .run({ user, passwordHash });
}

export async function changePassword(user, password) {
  const passwordHash = await encodePassword(password);

  return db
    .prepare("UPDATE users SET passwordHash = @passwordHash WHERE user = @user")
    .run({ user, passwordHash });
}
