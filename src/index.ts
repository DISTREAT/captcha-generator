import gmConstructor from "gm";
import { Writable } from "node:stream";

const gm = gmConstructor.subClass({ imageMagick: true });

export interface GeneratorOptions {
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

    constructor(options: GeneratorOptions) {
        this.options = { ...defaultGeneratorOptions, ...options };
    }

    generateImage(writeStream: Writable, solution: string): void {
        const context = gm(this.options.width!, this.options.height!, "#ffffff");
        let last_position_x = this.options.padding! - this.options.spacing!;

        for (let index = 0; index < solution.length; index++) {
            last_position_x = getRandomInt(
                last_position_x + this.options.spacing!,
                Math.min(
                    this.options.width! - this.options.padding!,
                    last_position_x + (this.options.width! / solution.length)
                )
            ),

            context.fontSize(this.options.fontSize!).draw(`
                translate
                ${last_position_x},${getRandomInt(this.options.padding!, this.options.height! - this.options.padding!)}
                rotate
                ${getRandomInt(this.options.rotationLimit![0], this.options.rotationLimit![1])}
                text
                0,0
                "${solution[index]}"
            `);
        }

        context.swirl(this.options.swirl!);
        context.noise("impulse");

        context.compress("LZMA").quality(60).stream("jpeg", function (error, stdout, stderr) {
            if (error) throw error;
            stdout.pipe(writeStream);
        });
    }
}

// convenience function
function getRandomInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

