const fs = require('fs');
const PNG = require('pngjs').PNG;
/*
    Utilities
    =========
*/
const PNG_OPTIONS = {
    GRAYSCALE_AND_ALPHA: 4,
    FILTER: 4
}
function Pixel(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
    return this;
};
// Turn each raw pixel into a keyed RGBA object.
PNG.prototype.toNamedPixels = function() {
    const named = [];
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            named.push(new Pixel(
                this.data[idx],
                this.data[idx + 1],
                this.data[idx + 2],
                this.data[idx + 3]));
        }
    }
    return named;
};
// Transform our patterns into coordinates for the output share png.
// This code looks hard but really isn't that important to understand.
// It just copies each pattern into place in the share png.
PNG.prototype.fillFromPatterns = function(patterns) {
    var png = this;
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
            // Find the pattern for this pixel.
            const row = Math.floor(y / 2);
            const column = Math.floor(x / 2);
            const patternsPerRow = png.width / 2;
            const pattern = patterns[row * patternsPerRow + column]
            // Now copy the relevant part of the pattern for this subpixel.
            const top = y % 2 === 0;
            const left = x % 2 === 0;
            let part;
            if (top && left) {
                part = pattern[0];
            } else if (top && !left) {
                part = pattern[1];
            } else if (!top && left) {
                part = pattern[2];
            } else {
                part = pattern[3];
            }
            const idx = (png.width * y + x) << 2;
            png.data[idx] = part.red;
            png.data[idx + 1] = part.green;
            png.data[idx + 2] = part.blue;
            png.data[idx + 3] = part.alpha;
        }
    }
};
/*
    Implementation
    ==============
*/
const secretStream = fs.createReadStream('github.png');
const shareOneStream = fs.createWriteStream('github-share-1.png');
const shareTwoStream = fs.createWriteStream('github-share-2.png');
const patternA = [
    /*
    Pattern A
       B W   
       W B   
    */
    new Pixel(0, 0, 0, 255),
    new Pixel(0, 0, 0, 0),
    new Pixel(0, 0, 0, 0),
    new Pixel(0, 0, 0, 255)
];
const patternB = [
    /*
    Pattern B
       W B
       B W 
    */
    new Pixel(0, 0, 0, 0),
    new Pixel(0, 0, 0, 255),
    new Pixel(0, 0, 0, 255),
    new Pixel(0, 0, 0, 0)
];
// This is the important function -- it's how we encode our shares.
// Given a secret pixel, subdivide it into four subpixels with a set pattern.
const subdivideSecretPixel = (pixel) => {
    const redPill = Math.random() > 0.5;
    if (pixel.alpha > 0) {
        // The pixel is coloured in the secret.
        // When overlaid, all four subdivisions in the shares need to be black.
        if (redPill) return [patternA, patternB];
        return [patternB, patternA];
    }
    // The pixel in the secret was not coloured.
    // When overlaid, only two of the four subdivisions should be black.
    if (redPill) return [patternA, patternA];
    return [patternB, patternB];
};
secretStream.pipe(new PNG({
        filterType: PNG_OPTIONS.FILTER,
        colorType: PNG_OPTIONS.GRAYSCALE_AND_ALPHA
    }))
    .on('parsed', function() {
        const secret = this;
        const shareOptions = {
            filterType: PNG_OPTIONS.FILTER,
            colorType: PNG_OPTIONS.GRAYSCALE_AND_ALPHA,
            // We will subdivide each pixel in the secret image into four components.
            width: secret.width * 2,
            height: secret.height * 2
        };
        const shareOnePng = new PNG(shareOptions);
        const shareTwoPng = new PNG(shareOptions);
        const pixels = secret.toNamedPixels();
        // This is the key step. Split and encode each pixel into its subdivided components.
        const subdivided = pixels.map(subdivideSecretPixel);
        const shareOnePatterns = subdivided.map(s => s[0]);
        const shareTwoPatterns = subdivided.map(s => s[1]);
        // Each pixel in the secret image has been split into four parts for each share.
        // Perfecto 👌.
        shareOnePng.fillFromPatterns(shareOnePatterns)
        shareTwoPng.fillFromPatterns(shareTwoPatterns)
        shareOnePng.pack().pipe(shareOneStream);
        shareTwoPng.pack().pipe(shareTwoStream);
    });