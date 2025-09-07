import meow from "meow";
import prompts from "prompts";

import "./env.js";

import { getUserByName, createUser, changePassword } from "./db.js";

async function commandCreateUser() {
  let response = await prompts({
    type: "text",
    name: "username",
    message: "Username",
    validate: value =>
      getUserByName(value) ? "This user already exists" : true
  });

  const username = response.username;

  response = await prompts({
    type: "password",
    name: "password",
    message: "Password"
  });

  const password = response.password;

  await createUser(username, password);
  console.log("User created");
}

async function commandChangePassword() {
  let response = await prompts({
    type: "text",
    name: "username",
    message: "What username do you want to change the password for ?",
    validate: value =>
      getUserByName(value) ? true : "This user doesn't exist."
  });

  const username = response.username;

  response = await prompts({
    type: "password",
    name: "password",
    message: "Password"
  });

  const password = response.password;

  await changePassword(username, password);
  console.log("Password changed");
}

const help = `
Usage
  $ comics <command>

Commands
  createUser
  changePassword
`;

const cli = meow(help, {
  importMeta: import.meta,
});

if (!cli.input.length) {
  console.log(help);
  process.exit(1);
}

const command = cli.input[0];

switch (command) {
  case "createUser":
    commandCreateUser();
    break;
  case "changePassword":
    commandChangePassword();
    break;
  default:
    console.log(help);
    process.exit(1);
}
