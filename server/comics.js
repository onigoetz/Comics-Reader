import chalk from "chalk";

import IndexCreator from "./tree/IndexCreator.js";

const error = chalk.red;
const title = chalk.underline.bold;

const comicsIndex = new IndexCreator(process.env.DIR_COMICS);

console.log(title("Generating index"));
comicsIndex.getList().then(
  () => {
    console.log(title("Index ready ! Have a good read !"));
  },
  e => {
    console.error(error("Could not create index"), e);
  }
);

export default comicsIndex;
