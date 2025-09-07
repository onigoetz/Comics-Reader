import test from "ava";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

// This is provided by nextjs at runtime
import "web-streams-polyfill/polyfill";

import PDF from "../../../server/books/PDF.js";
import BatchWorker from "../../../server/batch-worker.js";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

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

    t.truthy(stat.size > 230000);
})
