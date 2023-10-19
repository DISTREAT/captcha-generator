import { Suite } from "asyncmark";
import { Generator } from "./src/index";
import { PassThrough } from "node:stream";

const generator = new Generator({});
const suite = new Suite({ parallel: true });

suite.add({
    number: 1000,
    fun () {
        const xs = new PassThrough();
        generator.generateImage(xs, "code");
    }
});

suite.run();

