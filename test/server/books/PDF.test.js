const test = require("ava");
const fs = require("fs");
const path = require("path");

// This is provided by nextjs at runtime
require("web-streams-polyfill");

const PDF = require("../../../server/books/PDF.js");
const BatchWorker = require("../../../server/batch-worker.js");

const fixture = path.join(__dirname, "..", "..", "fixtures", "Comics", "pdfa.org-New PDF Optimization Easily Boost Print Shop Speed to Market.pdf");

test("Should list files correctly", async (t) => {
    const book = new PDF(fixture, new BatchWorker());

    const pages = await book.getPages();

    t.is(pages.length, 2)

    t.snapshot(pages.map(page => ({...page, src: page.src.replace(fixture, "__PATH__")})));
});

test("Should extract one file", async (t) => {
    const file = "2.png";

    const book = new PDF(fixture, new BatchWorker());

    const extract = await book.extractFile(file);

    const stat = await fs.promises.stat(extract.path);

    t.truthy(stat.size > 260000);
})
