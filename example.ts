import { Generator } from "./src/index";
import { createWriteStream } from "node:fs";

const generator = new Generator();
const writeStream = createWriteStream("./captcha.jpeg");
generator.generateImage(writeStream, "xfe2");

