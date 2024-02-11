const { red, underline, bold } = require("colorette");

const IndexCreator = require("./tree/IndexCreator");

const comicsIndex = new IndexCreator(process.env.DIR_COMICS);

console.log(underline(bold("Generating index")));
comicsIndex.getList().then(
  () => {
    console.log(underline(bold("Index ready ! Have a good read !")));
  },
  e => {
    console.error(red("Could not create index"), e);
  }
);

module.exports = comicsIndex;
