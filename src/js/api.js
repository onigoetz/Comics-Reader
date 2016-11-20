import axios from "axios";
import Immutable from "immutable";
import {TYPE_DIR, TYPE_BOOK} from "./types";

var books;

function dirname(path) {

    if (path.indexOf("/") === -1) {
        return "";
    }

    return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '')
}

function cleanEntry(key, entry) {
    entry.parent = dirname(key);

    if (!entry.loaded) {
        entry.loaded = !!entry.books;
    }

    entry.type = entry.books ? TYPE_DIR : TYPE_BOOK;

    return Immutable.fromJS(entry);
}

function cleanEntries(data) {

    let cleanedData = Immutable.Map();

    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            cleanedData = cleanedData.set(i, cleanEntry(i, data[i]));
        }
    }

    return cleanedData;
}

function onlySuccess(v) {
    if (v.status != 200) {
        throw new Error("Failed with status " + v.status + " and message: " + v.statusText);
    }

    return v;
}

function getAllFolders() {
    if (books) {
        return Promise.resolve(books);
    }

    return axios.get(window.baseURL + "/books.json").then(onlySuccess).then(v => {
        books = cleanEntries(v.data);

        return books;
    });
}

function getMissingBook(id) {
    return axios.get(window.baseURL + "/books/" + id + ".json").then(onlySuccess).then(v => {
        books = books.set(id, cleanEntry(id, v.data));

        return books.get(id);
    });
}

/**
 * Replace the books with the instances form the saved tree
 *
 * @param source
 * @returns {*}
 */
function prepare(source) {
    let data = source;

    if (data.has("parent") && typeof data.get("parent") == "string") {
        data = data.set("parent", books.get(data.get("parent")));
    }

    if (data.has('books')) {
        data = data.update('books', (currentBooks => currentBooks.map(element => books.get(element))));
    }

    return data.toJS();
}

export function getList(unescaped) {

    const id = decodeURIComponent(unescaped);

    return new Promise((resolve, reject) => {
        getAllFolders().then(v => {
            if (!v.has(id)) {
                console.error("Could not find book");
                reject("could not find book");
            }

            let data = v.get(id);

            if (data.get("loaded")) {
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
