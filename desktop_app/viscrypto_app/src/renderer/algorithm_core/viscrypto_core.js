/* eslint-disable */

// These are the two most important modules for the 
// visualization algorithm
const fs = require('fs');//file stream, to read and write files
const PNG = require('pngjs').PNG;//pngjs, to manipulate png files

//PNG_OPTIONS
const PNG_OPTIONS = {
    GRAYSCALE_AND_ALPHA: 4,
    FILTER: 4
}
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
// This is the important function -- it's how we encode our shares.
// Given a secret pixel, subdivide it into four subpixels with a set pattern.
function subdivideSecretPixel(pixel) {
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


//The actual object we are exporting with all functionalities
const viscryptoCore = {
    //variables and constants
    
    //Implementation
    originalImage: 'hey',
    share1Image: '',
    share2Image: '',
    generateImages: function(){
        if(this.originalImage === null || this.originalImage === undefined 
            || this.share1Image === null || this.share1Image === undefined
            || this.share2Image === null || this.share2Image === undefined){
                console.log("One of the target image names/resources is empty. Please check that the original image and the two split destinations are ready");
                return;
            }

        const secretStream = fs.createReadStream(this.originalImage);
        const shareOneStream = fs.createWriteStream(this.share1Image);
        const shareTwoStream = fs.createWriteStream(this.share2Image);

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
    },
    init: function (newOriginalImage, newShare1Image, newShare2Image) {
        console.log('init viscrypto algorithm: ');
        console.table({'newOriginalImage' : newOriginalImage, 'newShare1Image' : newShare1Image, 'newShare2Image' : newShare2Image})
        this.setOriginalImage(newOriginalImage);
        this.setShare1Image(newShare1Image);
        this.setShare2Image(newShare2Image);
        this.generateImages();
    },
    setOriginalImage: function(newOriginalImage){
        this.originalImage = newOriginalImage;
    },
    setShare1Image: function(newShare1Image){
        this.share1Image = newShare1Image;
    },
    setShare2Image: function(newShare2Image){
        this.share2Image = newShare2Image;
    }
}

export default viscryptoCore
