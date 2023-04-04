/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";

let files = fs.readdirSync(`${__dirname}`);
files = files.filter((x: string) => {
    return !x.includes("index.") && !x.includes(".map");
});
const controllers = files.map((d: string) => {
    const fileName = `./${d}`.replace(".ts","");
    const controller = require(fileName);

    return controller["default"];
});

export default controllers;
