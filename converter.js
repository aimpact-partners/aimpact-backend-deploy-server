"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@aimpact/backend/aihub");
var dependency_2 = require("fluent-ffmpeg");
var dependency_3 = require("path");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/converter"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([['@aimpact/backend/aihub', dependency_1], ['fluent-ffmpeg', dependency_2], ['path', dependency_3]]);
const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 1855930919,
  creator: function (require, exports) {
    "use strict";

    var ffmpeg = require("fluent-ffmpeg");
    var path = require("path");
    // Set the path to the FFmpeg binary
    ffmpeg.setFfmpegPath('/path/to/your/ffmpeg/bin');
    // Create a function to convert audio files
    function convertAudio(inputFile, outputFormat) {
      // Extract the directory, name, and extension from the input file path
      const parsedPath = path.parse(inputFile);
      // Generate the output file path
      const outputFile = path.format({
        dir: parsedPath.dir,
        name: parsedPath.name,
        ext: '.' + outputFormat
      });
      ffmpeg(inputFile).output(outputFile).on('end', function () {
        console.log('Conversion finished');
      }).on('error', function (err) {
        console.log('Error: ' + err);
      }).run();
    }
    // Use the function
    // convertAudio("path/to/input.mp3", "wav");
  }
});

// Module exports
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFQTtJQUNBO0lBRUE7SUFDQUEsTUFBTSxDQUFDQyxhQUFhLENBQUMsMEJBQTBCLENBQUM7SUFFaEQ7SUFDQSxTQUFTQyxZQUFZLENBQUNDLFNBQWlCLEVBQUVDLFlBQW9CO01BQzVEO01BQ0EsTUFBTUMsVUFBVSxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0osU0FBUyxDQUFDO01BRXhDO01BQ0EsTUFBTUssVUFBVSxHQUFHRixJQUFJLENBQUNHLE1BQU0sQ0FBQztRQUM5QkMsR0FBRyxFQUFFTCxVQUFVLENBQUNLLEdBQUc7UUFDbkJDLElBQUksRUFBRU4sVUFBVSxDQUFDTSxJQUFJO1FBQ3JCQyxHQUFHLEVBQUUsR0FBRyxHQUFHUjtPQUNYLENBQUM7TUFFRkosTUFBTSxDQUFDRyxTQUFTLENBQUMsQ0FDZlUsTUFBTSxDQUFDTCxVQUFVLENBQUMsQ0FDbEJNLEVBQUUsQ0FBQyxLQUFLLEVBQUU7UUFDVkMsT0FBTyxDQUFDQyxHQUFHLENBQUMscUJBQXFCLENBQUM7TUFDbkMsQ0FBQyxDQUFDLENBQ0RGLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVUcsR0FBRztRQUN6QkYsT0FBTyxDQUFDQyxHQUFHLENBQUMsU0FBUyxHQUFHQyxHQUFHLENBQUM7TUFDN0IsQ0FBQyxDQUFDLENBQ0RDLEdBQUcsRUFBRTtJQUNSO0lBRUE7SUFDQSIsIm5hbWVzIjpbImZmbXBlZyIsInNldEZmbXBlZ1BhdGgiLCJjb252ZXJ0QXVkaW8iLCJpbnB1dEZpbGUiLCJvdXRwdXRGb3JtYXQiLCJwYXJzZWRQYXRoIiwicGF0aCIsInBhcnNlIiwib3V0cHV0RmlsZSIsImZvcm1hdCIsImRpciIsIm5hbWUiLCJleHQiLCJvdXRwdXQiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJlcnIiLCJydW4iXSwic291cmNlUm9vdCI6IkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==