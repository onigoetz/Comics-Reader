const Node = require("./Node");

module.exports = class RootNode extends Node {
  getNode(key) {
    let node = this;

    if (!key) {
      return node;
    }

    const child = node.getChild(key);
    if (child) {
      return child;
    }

    const segments = key.split("/");
    for (const i in segments) {
      if (segments.hasOwnProperty(i)) {
        const segment = segments[i];

        node = node.getChild(segment);

        if (!node) {
          throw new Error("Node not found");
        }
      }
    }

    return node;
  }
};
