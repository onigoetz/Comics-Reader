// @ts-check

import express from "express";

import imagecache from "./images/cache/[preset]/[...image].js";

import authMode from "./api/auth_mode.js";
import changePassword from "./api/change_password.js";
import errors from "./api/errors.js";
import indexReady from "./api/indexready.js";
import search from "./api/search.js";
import token from "./api/token.js";

import read from "./api/read/[read].js";
import list from "./api/list/[list].js";
import book from "./api/book/[book].js";

export async function registerRoutes(server) {
  server.use("/images", express.static("images"));
  server.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, imagecache);

  server.get("/api/auth_mode", authMode);
  server.post("/api/change_password", changePassword);
  server.get("/api/errors", errors);
  server.get("/api/indexready", indexReady);
  server.post("/api/search", search);
  server.post("/api/token", token);

  server.post("/api/read/:read", read);

  server.get("/api/list", list);
  server.get("/api/list/:list", list);
  server.get("/api/book/:book", book);
}
