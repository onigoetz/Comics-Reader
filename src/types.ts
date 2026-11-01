export const TYPE_BOOK = "book";
export const TYPE_DIR = "dir";

export type NodeType = typeof TYPE_BOOK | typeof TYPE_DIR;

export interface ClientNode {
  name: string;
  type: NodeType;
  thumb: string;
  path: string;
}

export interface ListItem extends ClientNode {
  thumbWidth: number;
  read: boolean;
  booksInsideRead: number;
  booksInside: number;
}

export interface Page {
  src: string;
  width: number;
  height: number;
}

export interface ListResponse {
  dir: ClientNode;
  parent: ClientNode | null;
  books: ListItem[];
}

export interface BookResponse {
  book: ClientNode;
  parent: ClientNode | null;
  read: boolean;
  pages: Page[];
}

export interface SearchResult extends ClientNode {
  parent: string | null;
}

export interface IndexReadyResponse {
  ready: boolean;
  books: number;
  thumbs: number;
  phase: "NONE" | "SCAN" | "THUMBS" | string;
}

export interface IndexError {
  message: string;
  stack: string;
}

export interface ImageData {
  isRetina: boolean;
  supportsWebp: boolean;
}
