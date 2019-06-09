//@ts-check

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
    return this.count() === 0 ? "tome" : "dir";
  }

  getParent() {
    return this.parent;
  }

  getPath() {
    if (!this.parent) {
      return this.name;
    }

    return `${this.parent.getPath()}/${this.getName()}`;
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

  dump() {
    return {
      name: this.getName(),
      type: this.getType(),
      thumb: this.getThumb(),
      path: this.getPath(),
      count: this.count()
    };
  }
};
