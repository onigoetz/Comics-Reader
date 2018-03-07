const naturalSort = require("natural-sort")();

module.exports = class TreeWalker {
  constructor(tree) {
    this.tree = tree;
    this.routes = {};
  }

  toJson() {
    this.routes[""] = {
      name: this.tree.getName(),
      books: this.iterate(this.tree.getChildren())
    };

    return this.routes;
  }

  iterate(entries) {
    if (!entries.length) {
      return [];
    }

    return entries
      .filter(row => row.getThumb())
      .map(row => {
        const data = {};

        // The books props differentiates dirs and books
        if (row.getType() === "dir") {
          data.books = this.iterate(row.getChildren());
        }

        this.routes[row.getPath()] = data;

        return row.getName();
      })
      .sort(naturalSort);
  }
};
