import test from "ava";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

import Zip from "../../../server/books/Zip.js";
import BatchWorker from "../../../server/batch-worker.js";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const fixture = path.join(__dirname, "..", "..", "fixtures", "Comics", "Full of Fun", "Full_of_Fun_001__Decker_Pub._1957.08__c2c___soothsayr_Yoc.cbz")

test("Should list files correctly", async (t) => {
    const book = new Zip(fixture, new BatchWorker());

    const pages = await book.getPages();

    t.is(pages.length, 37)

    t.snapshot(pages.map(page => ({...page, src: page.src.replace(fixture, "__PATH__")})));
});

test("Should extract one file", async (t) => {
    const file = "11.jpg";

    const book = new Zip(fixture, new BatchWorker());

    const extract = await book.extractFile(file);

    const stat = await fs.promises.stat(extract.path);

    t.is(stat.size, 1124548);
})
