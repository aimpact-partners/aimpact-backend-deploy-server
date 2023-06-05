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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmZm1wZWciLCJyZXF1aXJlIiwicGF0aCIsInNldEZmbXBlZ1BhdGgiLCJjb252ZXJ0QXVkaW8iLCJpbnB1dEZpbGUiLCJvdXRwdXRGb3JtYXQiLCJwYXJzZWRQYXRoIiwicGFyc2UiLCJvdXRwdXRGaWxlIiwiZm9ybWF0IiwiZGlyIiwibmFtZSIsImV4dCIsIm91dHB1dCIsIm9uIiwiY29uc29sZSIsImxvZyIsImVyciIsInJ1biJdLCJzb3VyY2VzIjpbIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOltudWxsXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUEsSUFBQUEsTUFBQSxHQUFBQyxPQUFBO0lBQ0EsSUFBQUMsSUFBQSxHQUFBRCxPQUFBO0lBRUE7SUFDQUQsTUFBTSxDQUFDRyxhQUFhLENBQUMsMEJBQTBCLENBQUM7SUFFaEQ7SUFDQSxTQUFTQyxZQUFZQSxDQUFDQyxTQUFpQixFQUFFQyxZQUFvQjtNQUM1RDtNQUNBLE1BQU1DLFVBQVUsR0FBR0wsSUFBSSxDQUFDTSxLQUFLLENBQUNILFNBQVMsQ0FBQztNQUV4QztNQUNBLE1BQU1JLFVBQVUsR0FBR1AsSUFBSSxDQUFDUSxNQUFNLENBQUM7UUFDOUJDLEdBQUcsRUFBRUosVUFBVSxDQUFDSSxHQUFHO1FBQ25CQyxJQUFJLEVBQUVMLFVBQVUsQ0FBQ0ssSUFBSTtRQUNyQkMsR0FBRyxFQUFFLEdBQUcsR0FBR1A7T0FDWCxDQUFDO01BRUZOLE1BQU0sQ0FBQ0ssU0FBUyxDQUFDLENBQ2ZTLE1BQU0sQ0FBQ0wsVUFBVSxDQUFDLENBQ2xCTSxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQ1ZDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLHFCQUFxQixDQUFDO01BQ25DLENBQUMsQ0FBQyxDQUNERixFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVVHLEdBQUc7UUFDekJGLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsR0FBR0MsR0FBRyxDQUFDO01BQzdCLENBQUMsQ0FBQyxDQUNEQyxHQUFHLEVBQUU7SUFDUjtJQUVBO0lBQ0EifQ==