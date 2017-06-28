/* global fetch */
import {TYPE_DIR, TYPE_BOOK} from "./types";

let books;

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

    if (data.books) {
        data.books = data.books.map(book => books.get(book));
    }

    return data;
}

export function getList(unescaped) {

    let id = decodeURIComponent(unescaped);
    if (id === "/") {
        id = "";
    }

    return new Promise((resolve, reject) => {
        getAllFolders().then(v => {
            if (!v.has(id)) {
                console.error("Could not find book");
                reject("could not find book");
            }

            let data = v.get(id);

            if (data.loaded) {
                resolve(prepare(data));
            } else {
                getMissingBook(id).then(v => {
                    resolve(prepare(v));
                }).catch((e) => {
                    console.error(e);
                    reject("Failed");
                });
            }
        }).catch((e) => {
            console.error(e);
            reject("Failed");
        })
    });
}
