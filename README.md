# CAPTCHA-Generator

An opinionated captcha image generator for displaying text -
trying to mitigate the risk of OCR.

_There are currently no further accessibility options available._

## Motivation

Only a handful of web developers seem capable of implementing a [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA)
while also thinking as much as one step ahead. I support this statement by the observations I've made from taking
a look at a good bunch of GitHub repositories related to this topic:
- The first project I encountered was an [SVG](https://en.wikipedia.org/wiki/SVG) CAPTCHA
generator. I do not understand the thought process of adding noise to the CAPTCHA, because
an SVG is easily separable into its different objects, unlike a PNG where the layers are not
made clear. Added noise in this case does not hinder an OCR engine from recognizing anything.
- The same issue applies to solutions where the CAPTCHA solution is differentiated through color.
A simple color filter would also remove all the added noise.
- To my surprise, I have faced way too many solutions that did not get the objective of trying
to distinguish a bot from a human, suggesting to insert the CAPTCHA solution into the DOM, styling
the added text using CSS.

_I purposefully did not mention any names, as I do not wish to call anyone out.
Making mistakes is fine and a learning process._

Although I am in shock, there are other honorable mentions:
- One [solution](https://github.com/ivanarena/uncaptchable) stood out to me. This approach is indeed
innovative and might be the next step after neural networks overcome the issue of CAPTCHAs which requires
to user to retype a code found in an image, outbeating the issues of current OCR technology. Nonetheless,
this would only solve the issue until AI models are trained to recognize these challenges as well. Another
flaw would be to have a low count of images, as you could just detect recorded patterns.
- Another mentionable solution is [DotCHA](https://github.com/SuziKim/DotCHA) which I feel has a good chance of
surviving for a longer time to come, but the user-friendliness, in contrast, does not seem like the scope
of the project, because it took me way too long to identify the demoed CAPTCHAs.

_To me, this whole issue seems like a cat-and-mouse game._

I decided to give this project a go myself because, at the time, I needed a decent captcha challenge that
would be able to sustain some time and is certainly not as easily defeatable as the other projects I have
taken a look at. In addition, [node-canvas](https://www.npmjs.com/package/canvas) was not supported by
[bun](https://bun.sh/) at the time, which also contributed to the motivation.

## Design

The main idea was to spread the CAPTCHA solution over a blank canvas, causing the text to be misaligned.
This would presumable prevent most recognition software from being able to piece the single characters
together. In addition to that I also figured that adding distortion to the letters (rotation and warp)
would potentially prevent single characters from being identified. Of course this system is nowhere near
bullet proof, but it certainly makes the task of writing a bot to defeat the captcha way harder.

The added noise on the other hand was not supposed to add any more difficulty, since they could theoretically
be filtered, because of a smaller line thickness.

## Testing

I have tested the generated CAPTCHA challenges against a decent bunch of OCR engines (such as GOCR and various
online OCR engines, including CAPTCHA solvers) with little to no success.
The challenges generated aren't exceptionally difficult and my be solvable with enough time, but the
goal is to reduce the amount of requests that could be crafted in a short duration. 

## Security

The whole generation process is supposed to be run server side, independent of any client-side parameters, and as such
there should be no risk of injections.

## Performance

The slightly off-putting performance is still the biggest issue at the moment, but it should not be too big of an issue,
since I suppose that another image generation software would be just as slow as [ImageMagick](https://imagemagick.org/index.php)
which is used by this library.

Although the image processing itself is probably the biggest bottleneck, it might make sense to use another programming language
in the future, because typescript/javascript is only so adequate for this task.

