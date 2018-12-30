const meow = require("meow");
const prompts = require("prompts");

const db = require("./db");

async function commandCreateUser() {
  let response = await prompts({
    type: "text",
    name: "username",
    message: "Username",
    validate: value => db.getUserByName(value) ? "This user already exists" : true
  });

  const username = response.username;

  response = await prompts({
    type: "password",
    name: "password",
    message: "Password"
  });

  const password = response.password;

  await db.createUser(username, password);
  console.log("User created");
}

async function commandChangePassword() {
  let response = await prompts({
    type: "text",
    name: "username",
    message: "What username do you want to change the password for ?",
    validate: value => db.getUserByName(value) ? true : "This user doesn't exist."
  });

  const username = response.username;

  response = await prompts({
    type: "password",
    name: "password",
    message: "Password"
  });

  const password = response.password;

  await db.changePassword(username, password);
  console.log("Password changed");
}

const help = `
Usage
  $ comics <command>

Commands
  createUser
  changePassword
`;

const cli = meow(help, {});

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
