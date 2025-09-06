//@ts-check

export default class Node {
  constructor(name, parent, type) {
    this.name = name;
    this.parent = parent;
    this.type = type;
    this.children = [];
  }

  count() {
    return this.children.length;
  }

  getName() {
    return this.name;
  }

  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
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

  removeEmptyDirs() {
    this.children = this.children.filter(node => node.getThumb());
    this.children.forEach(node => {
      node.removeEmptyDirs();
    });
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
