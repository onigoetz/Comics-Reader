const test = require("ava");
const fs = require("fs");
const path = require("path");

const Rar = require("../../../server/books/Rar.js");
const BatchWorker = require("../../../server/batch-worker.js");

const fixture = path.join(__dirname, "..", "..", "fixtures", "Comics", "Full of Fun", "Full_Of_Fun_001__c2c___1957___ABPC_.cbr")

test("Should list files correctly", async (t) => {
    const book = new Rar(fixture, new BatchWorker());

    const pages = await book.getPages();

    t.is(pages.length, 36)

    t.snapshot(pages.map(page => ({...page, src: page.src.replace(fixture, "__PATH__")})));
});

test("Should extract one file", async (t) => {
    const file = "Full Of Fun 001 (c2c) (1957) (ABPC)/FullF108.jpg";

    const book = new Rar(fixture, new BatchWorker());

    const extract = await book.extractFile(file);

    const stat = await fs.promises.stat(extract.path);

    t.is(stat.size, 436416);
})
