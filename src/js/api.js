/* global fetch */
import {TYPE_DIR, TYPE_BOOK} from "./types";

let books;
let readList = [];
let readListFetched = false;

function dirname(path) {
    return (path.indexOf("/") === -1) ? "" : path.replace(/\\/g, '/').replace(/\/[^/]*\/?$/, '');
}

function cleanEntry(key, entry) {
    entry.parent = dirname(key);

    if (!entry.loaded) {
        entry.loaded = !!entry.books;
    }

    entry.type = entry.books ? TYPE_DIR : TYPE_BOOK;

    return entry;
}

function cleanEntries(data) {
    let cleanedData = new Map();

    Object.keys(data).forEach(key => {
      cleanedData.set(key, cleanEntry(key, data[key]));
    });

    return cleanedData;
}

function onlySuccess(v) {
    if (v.status !== 200) {
        throw new Error("Failed with status " + v.status + " and message: " + v.statusText);
    }

    return v.json();
}

function getAllFolders() {
    if (books) {
        return Promise.resolve(books);
    }

    return fetch(window.baseURL + "api/books.json", {credentials: "include"}).then(onlySuccess).then(v => {
        books = cleanEntries(v);

        return books;
    });
}

function getMissingBook(id) {
    return fetch(window.baseURL + "api/books/" + id + ".json", {credentials: "include"}).then(onlySuccess).then(v => {
        const book = books.get(id);
        book.pages = v.pages;
        book.loaded = true;

        return book;
    });
}

function getRead() {
    if (readListFetched) {
        return Promise.resolve(readList);
    }

    return fetch(window.baseURL + "api/read", {credentials: "include"})
        .then(onlySuccess)
        .then(v => {
            readList = v;

            readListFetched = true;

            return readList;
        });
}

export function markRead(id) {
    return fetch(window.baseURL + "api/read/" + id, {credentials: "include", method: "POST"})
        .then(onlySuccess)
        .then(v => {
            readList = v;

            readListFetched = true;
        });
}

function isRead(id) {
    return readList.indexOf(id) > -1;
}

/**
 * Replace the books with the instances form the saved tree
 *
 * @param source
 * @returns {*}
 */
function prepare(source) {
    const data = JSON.parse(JSON.stringify(source));

    if (data.parent && typeof data.parent === "string") {
        data.parent = books.get(data.parent);
    }

    data.read = isRead(data.path);

    if (data.books) {
        data.books = data.books
            .map(book => books.get(book))
            .map(book => { 
                book.read = isRead(book.path);
                return book;
            });
    }

    return data;
}

export async function getList(unescaped) {
    let id = decodeURIComponent(unescaped);
    if (id === "/") {
        id = "";
    }

    try {
        await getRead();
    } catch(e) {
        console.error("Can't get read list");
        readList = [];
    }

    try {
        const folders = await getAllFolders();

        if (!folders.has(id)) {
            console.error("Could not find book");
            throw new Error("could not find book");
        }

        const data = folders.get(id);
        if (data.loaded) {
            return prepare(data);
        }

        const missingBook = await getMissingBook(id);

        return prepare(missingBook);
    } catch (e) {
        console.error(e);
        throw new Error("Failed")
    }
}
