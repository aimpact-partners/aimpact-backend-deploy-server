"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.hmr = exports.__beyond_pkg = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("fluent-ffmpeg");
var dependency_2 = require("fs");
var dependency_3 = require("path");
var dependency_4 = require("formidable");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/routes"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([['fluent-ffmpeg', dependency_1], ['fs', dependency_2], ['path', dependency_3], ['formidable', dependency_4]]);
const ims = new Map();

/*************************
INTERNAL MODULE: ./convert
*************************/

ims.set('./convert', {
  hash: 3601328167,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.convertFile = convertFile;
    var ffmpeg = require("fluent-ffmpeg");
    async function convertFile(inputPath, outputFormat) {
      return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace(/\.[^.]+$/, `.${outputFormat}`);
        ffmpeg(inputPath).output(outputPath).on('end', () => {
          console.log('File converted successfully!');
          resolve();
        }).on('error', err => {
          console.error('Error converting file:', err.message);
          reject(err);
        }).run();
      });
    }
  }
});

/*******************************
INTERNAL MODULE: ./generate-name
*******************************/

ims.set('./generate-name', {
  hash: 1607754668,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.generateCustomName = generateCustomName;
    function generateCustomName(baseName) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Months are 0-based in JavaScript
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      // Ensure each part of the date and time has a leading zero if necessary
      const paddedMonth = month < 10 ? '0' + month : month;
      const paddedDay = day < 10 ? '0' + day : day;
      const paddedHours = hours < 10 ? '0' + hours : hours;
      const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;
      const timestamp = `${year}${paddedMonth}${paddedDay}${paddedHours}${paddedMinutes}${paddedSeconds}`;
      return `${baseName}_${timestamp}`;
    }
  }
});

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 974028565,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.routes = routes;
    var fs = require("fs");
    var _path = require("path");
    var formidable = require("formidable");
    var _convert = require("./convert");
    var _generateName = require("./generate-name");
    /*bundle*/
    function routes(app) {
      const UPLOADS = (0, _path.join)(__dirname, `/uploads`);
      app.get("/", (req, res) => res.send("AImpact http server"));
      app.get("/list/:container", (req, res) => {
        const container = req.params.container;
        if (!container) {
          res.status(400).send(`You must specify a destination directory`);
        }
        const folder = (0, _path.join)(UPLOADS, container);
        if (!fs.existsSync(folder)) {
          return res.send([]);
        }
        fs.readdir(folder, (err, files) => {
          if (err) {
            console.error(err.message);
            return;
          }
          res.send(files);
        });
      });
      app.post("/upload", async (req, res) => {
        const form = formidable({
          multiples: true
        });
        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send("Error processing request");
          }
          if (!fields.container) {
            return res.status(400).send(`You must specify a destination directory, with the parameter "container"`);
          }
          if (!fields.project) {
            return res.status(403).send(`project required`);
          }
          if (!files.audio) {
            return res.status(400).send({
              status: false,
              error: "No file was uploaded"
            });
          }
          const {
            audio
          } = files;
          const supportedMimetypes = ["audio/mpeg", "audio/mpga", "audio/mp4", "audio/m4a", "audio/wav", "audio/webm", "video/mp4", "video/mpeg", "video/webm", "audio/x-m4a"];
          if (!supportedMimetypes.includes(files.audio.mimetype)) {
            return res.status(400).send(`Only MP3, MP4, MPEG, MPGA, M4A, WAV, and WEBM files are allowed`);
          }
          const folderPath = (0, _path.join)(UPLOADS, fields.project, fields.container);
          const audioName = fields.fileName ?? audio.originalFilename;
          const baseName = audioName ? audioName.split(".")[0] : "record_";
          function getFileExtension(filename) {
            const splitName = filename.split(".");
            return splitName.length > 1 ? splitName[splitName.length - 1] : null;
          }
          const fileName = `${(0, _generateName.generateCustomName)(baseName)}.${getFileExtension(audioName)}`;
          const temp = files.audio.filepath;
          const upload = (0, _path.join)(folderPath, fileName);
          try {
            await fs.promises.mkdir(folderPath, {
              recursive: true
            });
            await fs.promises.copyFile(temp, upload);
            await fs.promises.unlink(temp);
            const convertable = ["audio/x-m4a"];
            if (convertable.includes(audio.mimetype)) {
              await (0, _convert.convertFile)(upload, "mp3");
            }
            res.json({
              status: true,
              message: "File uploaded successfully",
              file: (0, _path.join)(fields.project, fields.container, fileName)
            });
          } catch (error) {
            console.error(error.message);
            res.status(500).send("Error saving file");
          }
        });
      });
    }
  }
});
__pkg.exports.descriptor = [{
  "im": "./index",
  "from": "routes",
  "name": "routes"
}];
let routes;

// Module exports
exports.routes = routes;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'routes') && (exports.routes = routes = require ? require('./index').routes : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEtBQUssQ0FBQ0MsT0FBTyxDQUFDO1lBQzVCOEIsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNILElBQUksQ0FBQyxtQkFBbUIsQ0FBQzs7UUFFN0MsQ0FBQyxDQUFDO01BQ0osQ0FBQyxDQUFDO0lBQ0oiLCJuYW1lcyI6WyJjb252ZXJ0RmlsZSIsImlucHV0UGF0aCIsIm91dHB1dEZvcm1hdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib3V0cHV0UGF0aCIsInJlcGxhY2UiLCJmZm1wZWciLCJvdXRwdXQiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJlcnIiLCJlcnJvciIsIm1lc3NhZ2UiLCJydW4iLCJnZW5lcmF0ZUN1c3RvbU5hbWUiLCJiYXNlTmFtZSIsIm5vdyIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF0ZSIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInNlY29uZHMiLCJnZXRTZWNvbmRzIiwicGFkZGVkTW9udGgiLCJwYWRkZWREYXkiLCJwYWRkZWRIb3VycyIsInBhZGRlZE1pbnV0ZXMiLCJwYWRkZWRTZWNvbmRzIiwidGltZXN0YW1wIiwicm91dGVzIiwiYXBwIiwiVVBMT0FEUyIsIl9fZGlybmFtZSIsImdldCIsInJlcSIsInJlcyIsInNlbmQiLCJjb250YWluZXIiLCJwYXJhbXMiLCJzdGF0dXMiLCJmb2xkZXIiLCJmcyIsImV4aXN0c1N5bmMiLCJyZWFkZGlyIiwiZmlsZXMiLCJwb3N0IiwiZm9ybSIsImZvcm1pZGFibGUiLCJtdWx0aXBsZXMiLCJwYXJzZSIsImZpZWxkcyIsInByb2plY3QiLCJhdWRpbyIsInN1cHBvcnRlZE1pbWV0eXBlcyIsImluY2x1ZGVzIiwibWltZXR5cGUiLCJmb2xkZXJQYXRoIiwiYXVkaW9OYW1lIiwiZmlsZU5hbWUiLCJvcmlnaW5hbEZpbGVuYW1lIiwic3BsaXQiLCJnZXRGaWxlRXh0ZW5zaW9uIiwiZmlsZW5hbWUiLCJzcGxpdE5hbWUiLCJsZW5ndGgiLCJ0ZW1wIiwiZmlsZXBhdGgiLCJ1cGxvYWQiLCJwcm9taXNlcyIsIm1rZGlyIiwicmVjdXJzaXZlIiwiY29weUZpbGUiLCJ1bmxpbmsiLCJjb252ZXJ0YWJsZSIsImpzb24iLCJmaWxlIl0sInNvdXJjZVJvb3QiOiJFOlxcd29ya3NwYWNlXFxhaW1wYWN0LyIsInNvdXJjZXMiOlsiY29udmVydC50cyIsImdlbmVyYXRlLW5hbWUudHMiLCJpbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsXX0=