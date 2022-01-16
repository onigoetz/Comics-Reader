//@ts-check

import Node from "./Node.js";

export default class RootNode extends Node {
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
        const prevNode = node;
        node = node.getChild(segment);

        if (!node) {
          throw new Error(
            `Node '${segment}' not found in '${prevNode.getName()}' for query '${key}'`
          );
        }
      }
    }

    return node;
  }

  getPath() {
    return null;
  }
};
