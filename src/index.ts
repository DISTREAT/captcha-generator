import { Writable } from "node:stream";
import spawn from "cross-spawn";

export interface GeneratorOptions {
    /// path to imagemagick executable
    executable?: string,
    /// width of the captcha
    width?: number,
    /// height of the captcha
    height?: number,
    /// move the characters away from the border
    padding?: number,
    /// add space between the characters
    spacing?: number,
    /// the font size of the characters
    fontSize?: number,
    /// the rotation limits of the characters [min, max]
    rotationLimit?: [number, number],
    /// degree of the center swirl
    swirl?: number
}

const defaultGeneratorOptions: GeneratorOptions = {
    executable: "/usr/bin/convert",
    width: 200,
    height: 85,
    padding: 26,
    spacing: 26,
    fontSize: 32,
    rotationLimit: [-70, 70],
    swirl: -50
};

export class Generator {
    private options: GeneratorOptions;
    private openingArgumentsIM: string[];
    private closingArgumentsIM: string[];

    constructor(options: GeneratorOptions) {
        this.options = { ...defaultGeneratorOptions, ...options };
        this.openingArgumentsIM = [
            "-size",
            `${this.options.width!}x${this.options.height!}`,
            "xc:#ffffff",
            "-pointsize",
            `${this.options.fontSize!}`
        ];
        this.closingArgumentsIM = [
            "-swirl",
            `${this.options.swirl!}`,
            "+noise",
            "impulse",
            "-compress",
            "LZMA",
            "-quality",
            "60",
            "webp:-"
        ];
    }

    generateImage(writeStream: Writable, solution: string): void {
        let last_position_x = this.options.padding! - this.options.spacing!;
        const drawingArgumentsIM: string[] = [];

        for (let index = 0; index < solution.length; index++) {
            last_position_x = getRandomInt(
                last_position_x + this.options.spacing!,
                Math.min(
                    this.options.width! - this.options.padding!,
                    last_position_x + (this.options.width! / solution.length)
                )
            ),

            drawingArgumentsIM.push(
                "-draw",
                `translate
                ${last_position_x},${getRandomInt(this.options.padding!, this.options.height! - this.options.padding!)}
                rotate
                ${getRandomInt(this.options.rotationLimit![0], this.options.rotationLimit![1])}
                text
                0,0
                "${solution[index]}"
                `
            );
        }

        const proc = spawn(
            this.options.executable!,
            [
                this.openingArgumentsIM,
                drawingArgumentsIM,
                this.closingArgumentsIM
            ].flat()
        );

        proc.on("close", function (code, signal) {
           if (code !== 0 || signal !== null) {
               throw new Error("There was an issue with ImageMagick");
           };
        });

        if (proc.stdout) {
            proc.stdout!.pipe(writeStream);
        } else {
            throw new Error("No image to stream");
        }
    }
}

// convenience function
function getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

