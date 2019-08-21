//@ts-check

const { TYPE_DIR, TYPE_BOOK } = require("./types");

module.exports = class Node {
  constructor($name, $parent = null) {
    this.name = $name;
    this.parent = $parent;
    this.children = [];
  }

  count() {
    return this.children.length;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.count() === 0 ? TYPE_BOOK : TYPE_DIR;
  }

  getParent() {
    return this.parent;
  }

  getPath() {
    const parent = this.parent ? this.parent.getPath() : null;
    const name = this.getName();

    return parent ? `${parent}/${name}` : name;
  }

  setChildren(children) {
    this.children = children;
  }

  /**
   * @return {Node[]} The children nodes
   */
  getChildren() {
    return this.children;
  }

  setThumb(thumb) {
    this.thumb = thumb;
  }

  /**
   * @return {string|boolean} path to the thumbnail
   */
  getThumb() {
    return this.thumb;
  }

  getChild(key) {
    return this.children.find(node => node.getName() === key);
  }

  forClient() {
    return {
      name: this.getName(),
      type: this.getType(),
      thumb: this.getThumb(),
      path: this.getPath()
    };
  }
};
