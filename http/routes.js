"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.hmr = exports.__beyond_pkg = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@google-cloud/storage");
var dependency_2 = require("@beyond-js/kernel/core");
var dependency_3 = require("fs");
var dependency_4 = require("os");
var dependency_5 = require("path");
var dependency_6 = require("firebase/app");
var dependency_7 = require("fluent-ffmpeg");
var dependency_8 = require("uuid");
var dependency_9 = require("formidable");
var dependency_10 = require("multer");
var dependency_11 = require("@aimpact/backend/api");
var dependency_12 = require("@aimpact/langchain/api");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/http-server@0.0.1/routes"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([['@google-cloud/storage', dependency_1], ['@beyond-js/kernel/core', dependency_2], ['fs', dependency_3], ['os', dependency_4], ['path', dependency_5], ['firebase/app', dependency_6], ['fluent-ffmpeg', dependency_7], ['uuid', dependency_8], ['formidable', dependency_9], ['multer', dependency_10], ['@aimpact/backend/api', dependency_11], ['@aimpact/langchain/api', dependency_12]]);
const ims = new Map();

/************************************
INTERNAL MODULE: ./bucket/credentials
************************************/

ims.set('./bucket/credentials', {
  hash: 560572196,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.firebaseConfig = void 0;
    const firebaseConfig = {
      apiKey: 'AIzaSyBYiZcPNBky2QvNdVwgCgU_v2B7feLtbQU',
      authDomain: 'aimpact-partners-dev.firebaseapp.com',
      projectId: 'aimpact-partners-dev',
      storageBucket: 'aimpact-partners-dev.appspot.com',
      messagingSenderId: '1081434267674',
      appId: '1:1081434267674:web:2edf6b533dd114f7d171a3',
      measurementId: 'G-TS0PT9FP2W'
    };
    exports.firebaseConfig = firebaseConfig;
  }
});

/*********************************
INTERNAL MODULE: ./bucket/download
*********************************/

ims.set('./bucket/download', {
  hash: 776577454,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.downloadFile = downloadFile;
    var _storage = require("@google-cloud/storage");
    var _core = require("@beyond-js/kernel/core");
    var _credentials = require("./credentials");
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    async function downloadFile(fileName) {
      // Construct file path in the bucket
      const promise = new _core.PendingPromise();
      const storage = new _storage.Storage();
      const bucketName = _credentials.firebaseConfig.storageBucket;
      const bucket = storage.bucket(bucketName);
      // Construct local file path
      const tempFilePath = path.join(os.tmpdir(), 'update.mp3');
      console.log(12, fileName, tempFilePath);
      // Download file from bucket to local temp directory
      const file = bucket.file(fileName);
      await file.download({
        destination: tempFilePath
      });
      // Create a read stream from the downloaded file
      const readStream = fs.createReadStream(tempFilePath);
      console.log(11, readStream);
      return readStream;
    }
  }
});

/*****************************
INTERNAL MODULE: ./bucket/file
*****************************/

ims.set('./bucket/file', {
  hash: 1308224253,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.FilestoreFile = void 0;
    var _storage = require("@google-cloud/storage");
    var os = require("os");
    var _app = require("firebase/app");
    var _credentials = require("./credentials");
    var fs = require("fs");
    var path = require("path");
    class FilestoreFile {
      app;
      storage;
      constructor() {
        this.app = (0, _app.initializeApp)(_credentials.firebaseConfig);
        this.storage = new _storage.Storage();
      }
      async upload(path, destination) {
        const bucketName = _credentials.firebaseConfig.storageBucket;
        await this.storage.bucket(bucketName).upload(path, {
          destination
        });
        return destination;
      }
      async write(fileUploaded, filename, name = "") {
        const bucketName = _credentials.firebaseConfig.storageBucket;
        const file = this.storage.bucket(bucketName).file(filename);
        const tempFilePath = path.join(os.tmpdir(), name);
        fs.promises.writeFile(tempFilePath, fileUploaded.buffer);
        return this.upload(tempFilePath, filename);
      }
    }
    exports.FilestoreFile = FilestoreFile;
  }
});

/*******************************
INTERNAL MODULE: ./bucket/folder
*******************************/

ims.set('./bucket/folder', {
  hash: 769373345,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.createFolderIfNotExists = createFolderIfNotExists;
    var _storage = require("@google-cloud/storage");
    // Instantiate the Storage client
    const storage = new _storage.Storage();
    async function createFolderIfNotExists(bucketName, folderName) {
      try {
        const bucket = storage.bucket(bucketName);
        // Check if the folder already exists
        const folderExists = await bucket.file(folderName).exists();
        if (folderExists[0]) return;
        // If the folder doesn't exist, create it
        return bucket.file(folderName).save('');
      } catch (err) {
        console.error('Error creating folder:', err);
      }
    }
  }
});

/******************************
INTERNAL MODULE: ./bucket/index
******************************/

ims.set('./bucket/index', {
  hash: 3381559045,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.uploadFile = uploadFile;
    var _storage = require("@google-cloud/storage");
    var _core = require("@beyond-js/kernel/core");
    var _app = require("firebase/app");
    var _credentials = require("./credentials");
    // Import the functions you need from the SDKs you need

    // Initialize Firebase
    const /*bundle */app = (0, _app.initializeApp)(_credentials.firebaseConfig);
    // const /*bundle */ analytics = getAnalytics(app);
    const storage = new _storage.Storage();
    async function uploadFile(buffer, filename) {
      // Uploads a buffer to the bucket
      const bucketName = _credentials.firebaseConfig.storageBucket;
      const file = storage.bucket(bucketName).file(filename);
      const promise = new _core.PendingPromise();
      const writeStream = file.createWriteStream({
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `metadata`, you can change the metadata of the
        // object you are uploading to a bucket.
        metadata: {
          cacheControl: 'public, max-age=31536000'
        }
      });
      writeStream.write(buffer);
      writeStream.on('error', _core.PendingPromise.reject);
      writeStream.on('finish', () => {
        _core.PendingPromise.resolve();
      });
      writeStream.end(buffer);
      console.log(`${filename} uploaded to ${bucketName}.`);
    }
  }
});

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 2582370093,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.routes = routes;
    var _audios = require("./routes/uploader/audios");
    var _documents = require("./routes/uploader/documents");
    var _list = require("./routes/list");
    var _list2 = require("./routes/documents/list");
    /*bundle*/
    function routes(app) {
      app.get("/", (req, res) => res.send("AImpact http server"));
      app.get("/list/:container", _list.list);
      app.get("/documents/:project/:container", _list2.documentsList);
      new _audios.UploaderAudio(app);
      new _documents.UploaderDocuments(app);
    }
  }
});

/********************************
INTERNAL MODULE: ./routes/convert
********************************/

ims.set('./routes/convert', {
  hash: 2247705921,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.convertFile = convertFile;
    exports.convertFileOLD = convertFileOLD;
    var ffmpeg = require("fluent-ffmpeg");
    var _core = require("@beyond-js/kernel/core");
    var _fs = require("fs");
    var _uuid = require("uuid");
    var os = require("os");
    var path = require("path");
    //...
    async function convertFile(inputFilePath, outputFormat) {
      const promise = new _core.PendingPromise();
      // output file path will be the same as the input file path but with a different extension
      const outputFilePath = `${inputFilePath.split(".")[0]}.${outputFormat}`;
      ffmpeg(inputFilePath).output(outputFilePath).on("end", async () => {
        // Delete the original file
        await _fs.promises.unlink(inputFilePath);
        promise.resolve(outputFilePath);
      }).on("error", async err => {
        console.log(err);
        promise.reject(err);
      }).run();
      return promise;
    }
    async function convertFileOLD(buffer, outputFormat) {
      // Create unique filenames for the temporary files
      const promise = new _core.PendingPromise();
      // Create unique filenames for the temporary files
      const tempDir = os.tmpdir();
      const tempDownloadPath = path.join(tempDir, `${(0, _uuid.v4)()}`);
      const tempUploadPath = path.join(tempDir, `${(0, _uuid.v4)()}.${outputFormat}`);
      // Write the buffer to a temporary file
      console.log(500, buffer);
      await _fs.promises.writeFile(tempDownloadPath, buffer);
      // Convert the file with ffmpeg
      ffmpeg(tempDownloadPath).output(tempUploadPath).on("end", async () => {
        promise.resolve(tempUploadPath);
      }).on("error", async err => {
        // Delete the temporary files in case of error too
        console.log(20, err);
        await _fs.promises.unlink(tempDownloadPath);
        await _fs.promises.unlink(tempUploadPath);
        promise.reject(err);
      }).run();
      return promise;
    }
  }
});

/***************************************
INTERNAL MODULE: ./routes/documents/list
***************************************/

ims.set('./routes/documents/list', {
  hash: 14401568,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.documentsList = void 0;
    var fs = require("fs");
    var _path = require("path");
    const UPLOADS = (0, _path.join)(__dirname, `/uploads`);
    const documentsList = (req, res) => {
      const {
        project,
        container
      } = req.params;
      const folderPath = (0, _path.join)(UPLOADS, project, "files", container); // Construct the folder path
      if (!fs.existsSync(folderPath)) {
        res.json({
          status: true,
          documents: []
        });
        return;
      }
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          // Handle error if the folder doesn't exist or there was an error reading it
          console.error(err);
          res.status(500).json({
            status: false,
            error: "Error reading folder."
          });
        } else {
          res.json({
            status: true,
            documents: files
          });
        }
      });
    };
    exports.documentsList = documentsList;
  }
});

/**************************************
INTERNAL MODULE: ./routes/generate-name
**************************************/

ims.set('./routes/generate-name', {
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

/*****************************
INTERNAL MODULE: ./routes/list
*****************************/

ims.set('./routes/list', {
  hash: 152931731,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.list = void 0;
    var _path = require("path");
    var fs = require("fs");
    const UPLOADS = (0, _path.join)(__dirname, `/uploads`);
    const list = (req, res) => {
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
    };
    exports.list = list;
  }
});

/*******************************
INTERNAL MODULE: ./routes/upload
*******************************/

ims.set('./routes/upload', {
  hash: 1391700419,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.manager = manager;
    var fs = require("fs");
    var _path = require("path");
    var formidable = require("formidable");
    var _convert = require("./convert");
    var _generateName = require("./generate-name");
    var _bucket = require("../bucket");
    async function manager(req, res) {
      const UPLOADS = (0, _path.join)(__dirname, `/uploads`);
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
        const supportedMimetypes = ["audio/mpeg", "audio/mpga", "audio/mp4", "audio/m4a", "audio/wav", "audio/x-m4a", "audio/webm", "video/mp4", "video/mpeg", "video/webm"];
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
          console.log(100, "llegamos", upload);
          await (0, _bucket.uploadFile)(upload);
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
    }
  }
});

/****************************************
INTERNAL MODULE: ./routes/uploader/audios
****************************************/

ims.set('./routes/uploader/audios', {
  hash: 2930746248,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UploaderAudio = void 0;
    var _path = require("path");
    var multer = require("multer");
    var _convert = require("../convert");
    var _generateName = require("../generate-name");
    var _file = require("../../bucket/file");
    var _api = require("@aimpact/backend/api");
    class UploaderAudio {
      #app;
      #api;
      #uploader;
      #supportedMimetypes = ["audio/mpeg", "audio/mpga", "audio/mp4", "audio/m4a", "audio/wav", "audio/x-m4a", "audio/webm", "video/mp4", "video/mpeg", "video/webm"];
      constructor(app) {
        this.#app = app;
        this.#uploader = multer;
        this.#uploader = multer({
          storage: multer.diskStorage({
            destination: "uploads",
            filename: this.setName
          })
        });
        this.#api = new _api.AIBackend();
        this.#app.post("/upload", this.#uploader.single("audio"), this.upload);
      }
      setName = (req, file, cb) => {
        const name = `${(0, _generateName.generateCustomName)(file.originalname)}${this.getExtension(file.mimetype)}`;
        cb(null, name);
      };
      getExtension(mimeType) {
        switch (mimeType) {
          case "audio/mpeg":
            return ".mp3";
          case "audio/aac":
            return ".aac";
          case "audio/wav":
            return ".wav";
          case "audio/ogg":
            return ".ogg";
          case "audio/webm":
            return ".webm";
          default:
            return null;
        }
      }
      upload = async (req, res) => {
        if (!req.file) {
          return res.status(400).send({
            status: false,
            error: "No file was uploaded"
          });
        }
        if (!this.#supportedMimetypes.includes(req.file.mimetype)) {
          return res.status(400).send(`Only MP3, MP4, MPEG, MPGA, M4A, WAV, and WEBM files are allowed`);
        }
        try {
          let finalPath;
          const convertable = ["audio/x-m4a"];
          const fileManager = new _file.FilestoreFile();
          const name = `${(0, _generateName.generateCustomName)(req.file.originalname)}${this.getExtension(req.file.mimetype)}`;
          const dest = `${req.body.container}${_path.sep}${name}`;
          if (convertable.includes(req.file.mimetype)) {
            const convertedFilePath = await (0, _convert.convertFile)(req.file.path, "mp3");
            finalPath = await fileManager.upload(convertedFilePath, dest);
          } else finalPath = await fileManager.upload(req.file.path, dest);
          const response = await this.#api.transcription(finalPath);
          if (!response.status) {
            res.json({
              status: false,
              error: `Error saving file: ${response.error}`
            });
            return;
          }
          res.json({
            status: true,
            message: "File uploaded successfully",
            file: dest,
            transcription: response.text
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Error saving file");
        }
      };
    }
    exports.UploaderAudio = UploaderAudio;
  }
});

/*******************************************
INTERNAL MODULE: ./routes/uploader/documents
*******************************************/

ims.set('./routes/uploader/documents', {
  hash: 3286617417,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UploaderDocuments = void 0;
    var _path = require("path");
    var multer = require("multer");
    var _generateName = require("../generate-name");
    var _file = require("../../bucket/file");
    var _api = require("@aimpact/langchain/api");
    class UploaderDocuments {
      #app;
      #api;
      #uploader;
      constructor(app) {
        this.#app = app;
        this.#api = new _api.ChainAPI();
        this.#uploader = multer({
          storage: multer.diskStorage({
            destination: "uploads",
            filename: this.setName
          })
        });
        this.#app.post("/upload/documents", this.#uploader.array("file"), this.upload);
      }
      getExtension(mimeType) {
        switch (mimeType) {
          case "text/plain":
            return ".txt";
          case "application/pdf":
            return ".pdf";
          case "application/msword":
            return ".doc";
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return ".docx";
          case "application/vnd.ms-excel":
            return ".xls";
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return ".xlsx";
          case "application/vnd.ms-powerpoint":
            return ".ppt";
          case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return ".pptx";
          case "application/rtf":
            return ".rtf";
          default:
            return null;
        }
      }
      setName = (req, file, cb) => {
        const name = `${(0, _generateName.generateCustomName)(file.originalname)}${this.getExtension(file.mimetype)}`;
        cb(null, name);
      };
      upload = async (req, res) => {
        if (!req.files.length) {
          return res.status(400).send({
            status: false,
            error: "No file was uploaded"
          });
        }
        try {
          //-
          const {
            project,
            container,
            topic
          } = req.body;
          for (const file of Object.values(req.files)) {
            // @ts-ignore
            const {
              path,
              originalname,
              mimetype
            } = file;
            const name = `${(0, _generateName.generateCustomName)(originalname)}${this.getExtension(mimetype)}`;
            const dest = `${project}${_path.sep}${container}${_path.sep}${topic}${_path.sep}${name}`;
            console.log(8, path, originalname);
            console.log(8.1, name);
            const fileManager = new _file.FilestoreFile();
            const finalPath = await fileManager.upload(path, dest);
            console.log("finalPath", finalPath);
            await this.#api.update(finalPath);
          }
          res.json({
            status: true,
            message: "File(s) uploaded successfully"
          });
          //-
        } catch (error) {
          console.error(error);
          res.status(500).send("Error uploading file(s)");
        }
      };
    }
    exports.UploaderDocuments = UploaderDocuments;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJmaXJlYmFzZUNvbmZpZyIsImFwaUtleSIsImF1dGhEb21haW4iLCJwcm9qZWN0SWQiLCJzdG9yYWdlQnVja2V0IiwibWVzc2FnaW5nU2VuZGVySWQiLCJhcHBJZCIsIm1lYXN1cmVtZW50SWQiLCJleHBvcnRzIiwiX3N0b3JhZ2UiLCJyZXF1aXJlIiwiX2NvcmUiLCJfY3JlZGVudGlhbHMiLCJmcyIsIm9zIiwicGF0aCIsImRvd25sb2FkRmlsZSIsImZpbGVOYW1lIiwicHJvbWlzZSIsIlBlbmRpbmdQcm9taXNlIiwic3RvcmFnZSIsIlN0b3JhZ2UiLCJidWNrZXROYW1lIiwiYnVja2V0IiwidGVtcEZpbGVQYXRoIiwiam9pbiIsInRtcGRpciIsImNvbnNvbGUiLCJsb2ciLCJmaWxlIiwiZG93bmxvYWQiLCJkZXN0aW5hdGlvbiIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiX2FwcCIsIkZpbGVzdG9yZUZpbGUiLCJhcHAiLCJjb25zdHJ1Y3RvciIsImluaXRpYWxpemVBcHAiLCJ1cGxvYWQiLCJ3cml0ZSIsImZpbGVVcGxvYWRlZCIsImZpbGVuYW1lIiwibmFtZSIsInByb21pc2VzIiwid3JpdGVGaWxlIiwiYnVmZmVyIiwiY3JlYXRlRm9sZGVySWZOb3RFeGlzdHMiLCJmb2xkZXJOYW1lIiwiZm9sZGVyRXhpc3RzIiwiZXhpc3RzIiwic2F2ZSIsImVyciIsImVycm9yIiwidXBsb2FkRmlsZSIsIndyaXRlU3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJnemlwIiwibWV0YWRhdGEiLCJjYWNoZUNvbnRyb2wiLCJvbiIsInJlamVjdCIsInJlc29sdmUiLCJlbmQiLCJfYXVkaW9zIiwiX2RvY3VtZW50cyIsIl9saXN0IiwiX2xpc3QyIiwicm91dGVzIiwiZ2V0IiwicmVxIiwicmVzIiwic2VuZCIsImxpc3QiLCJkb2N1bWVudHNMaXN0IiwiVXBsb2FkZXJBdWRpbyIsIlVwbG9hZGVyRG9jdW1lbnRzIiwiZmZtcGVnIiwiX2ZzIiwiX3V1aWQiLCJjb252ZXJ0RmlsZSIsImlucHV0RmlsZVBhdGgiLCJvdXRwdXRGb3JtYXQiLCJvdXRwdXRGaWxlUGF0aCIsInNwbGl0Iiwib3V0cHV0IiwidW5saW5rIiwicnVuIiwiY29udmVydEZpbGVPTEQiLCJ0ZW1wRGlyIiwidGVtcERvd25sb2FkUGF0aCIsInY0IiwidGVtcFVwbG9hZFBhdGgiLCJfcGF0aCIsIlVQTE9BRFMiLCJfX2Rpcm5hbWUiLCJwcm9qZWN0IiwiY29udGFpbmVyIiwicGFyYW1zIiwiZm9sZGVyUGF0aCIsImV4aXN0c1N5bmMiLCJqc29uIiwic3RhdHVzIiwiZG9jdW1lbnRzIiwicmVhZGRpciIsImZpbGVzIiwiZ2VuZXJhdGVDdXN0b21OYW1lIiwiYmFzZU5hbWUiLCJub3ciLCJEYXRlIiwieWVhciIsImdldEZ1bGxZZWFyIiwibW9udGgiLCJnZXRNb250aCIsImRheSIsImdldERhdGUiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJzZWNvbmRzIiwiZ2V0U2Vjb25kcyIsInBhZGRlZE1vbnRoIiwicGFkZGVkRGF5IiwicGFkZGVkSG91cnMiLCJwYWRkZWRNaW51dGVzIiwicGFkZGVkU2Vjb25kcyIsInRpbWVzdGFtcCIsImZvbGRlciIsIm1lc3NhZ2UiLCJmb3JtaWRhYmxlIiwiX2NvbnZlcnQiLCJfZ2VuZXJhdGVOYW1lIiwiX2J1Y2tldCIsIm1hbmFnZXIiLCJmb3JtIiwibXVsdGlwbGVzIiwicGFyc2UiLCJmaWVsZHMiLCJhdWRpbyIsInN1cHBvcnRlZE1pbWV0eXBlcyIsImluY2x1ZGVzIiwibWltZXR5cGUiLCJhdWRpb05hbWUiLCJvcmlnaW5hbEZpbGVuYW1lIiwiZ2V0RmlsZUV4dGVuc2lvbiIsInNwbGl0TmFtZSIsImxlbmd0aCIsInRlbXAiLCJmaWxlcGF0aCIsIm1rZGlyIiwicmVjdXJzaXZlIiwiY29weUZpbGUiLCJjb252ZXJ0YWJsZSIsIm11bHRlciIsIl9maWxlIiwiX2FwaSIsImFwaSIsInVwbG9hZGVyIiwiZGlza1N0b3JhZ2UiLCJzZXROYW1lIiwiQUlCYWNrZW5kIiwicG9zdCIsInNpbmdsZSIsImNiIiwib3JpZ2luYWxuYW1lIiwiZ2V0RXh0ZW5zaW9uIiwibWltZVR5cGUiLCJmaW5hbFBhdGgiLCJmaWxlTWFuYWdlciIsImRlc3QiLCJib2R5Iiwic2VwIiwiY29udmVydGVkRmlsZVBhdGgiLCJyZXNwb25zZSIsInRyYW5zY3JpcHRpb24iLCJ0ZXh0IiwiQ2hhaW5BUEkiLCJhcnJheSIsInRvcGljIiwiT2JqZWN0IiwidmFsdWVzIiwidXBkYXRlIl0sInNvdXJjZXMiOlsiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9idWNrZXQvY3JlZGVudGlhbHMudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2J1Y2tldC9kb3dubG9hZC50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvYnVja2V0L2ZpbGUudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2J1Y2tldC9mb2xkZXIudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2J1Y2tldC9pbmRleC50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvaW5kZXgudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L3JvdXRlcy9jb252ZXJ0LnRzIiwiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9yb3V0ZXMvZG9jdW1lbnRzL2xpc3QudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L3JvdXRlcy9nZW5lcmF0ZS1uYW1lLnRzIiwiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9yb3V0ZXMvbGlzdC50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3Qvcm91dGVzL3VwbG9hZC50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3Qvcm91dGVzL3VwbG9hZGVyL2F1ZGlvcy50cyIsIkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3Qvcm91dGVzL3VwbG9hZGVyL2RvY3VtZW50cy50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGxdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU8sTUFBTUEsY0FBYyxHQUFHO01BQzdCQyxNQUFNLEVBQUUseUNBQXlDO01BQ2pEQyxVQUFVLEVBQUUsc0NBQXNDO01BQ2xEQyxTQUFTLEVBQUUsc0JBQXNCO01BQ2pDQyxhQUFhLEVBQUUsa0NBQWtDO01BQ2pEQyxpQkFBaUIsRUFBRSxlQUFlO01BQ2xDQyxLQUFLLEVBQUUsNENBQTRDO01BQ25EQyxhQUFhLEVBQUU7S0FDZjtJQUFDQyxPQUFBLENBQUFSLGNBQUEsR0FBQUEsY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNSRixJQUFBUyxRQUFBLEdBQUFDLE9BQUE7SUFDQSxJQUFBQyxLQUFBLEdBQUFELE9BQUE7SUFDQSxJQUFBRSxZQUFBLEdBQUFGLE9BQUE7SUFDQSxJQUFBRyxFQUFBLEdBQUFILE9BQUE7SUFDQSxJQUFBSSxFQUFBLEdBQUFKLE9BQUE7SUFDQSxJQUFBSyxJQUFBLEdBQUFMLE9BQUE7SUFDTyxlQUFlTSxZQUFZQSxDQUFDQyxRQUFnQjtNQUNsRDtNQUNBLE1BQU1DLE9BQU8sR0FBRyxJQUFJUCxLQUFBLENBQUFRLGNBQWMsRUFBRTtNQUVwQyxNQUFNQyxPQUFPLEdBQUcsSUFBSVgsUUFBQSxDQUFBWSxPQUFPLEVBQUU7TUFDN0IsTUFBTUMsVUFBVSxHQUFHVixZQUFBLENBQUFaLGNBQWMsQ0FBQ0ksYUFBYTtNQUMvQyxNQUFNbUIsTUFBTSxHQUFHSCxPQUFPLENBQUNHLE1BQU0sQ0FBQ0QsVUFBVSxDQUFDO01BRXpDO01BQ0EsTUFBTUUsWUFBWSxHQUFHVCxJQUFJLENBQUNVLElBQUksQ0FBQ1gsRUFBRSxDQUFDWSxNQUFNLEVBQUUsRUFBRSxZQUFZLENBQUM7TUFDekRDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLEVBQUUsRUFBRVgsUUFBUSxFQUFFTyxZQUFZLENBQUM7TUFDdkM7TUFDQSxNQUFNSyxJQUFJLEdBQUdOLE1BQU0sQ0FBQ00sSUFBSSxDQUFDWixRQUFRLENBQUM7TUFDbEMsTUFBTVksSUFBSSxDQUFDQyxRQUFRLENBQUM7UUFBRUMsV0FBVyxFQUFFUDtNQUFZLENBQUUsQ0FBQztNQUVsRDtNQUNBLE1BQU1RLFVBQVUsR0FBR25CLEVBQUUsQ0FBQ29CLGdCQUFnQixDQUFDVCxZQUFZLENBQUM7TUFDcERHLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLEVBQUUsRUFBRUksVUFBVSxDQUFDO01BQzNCLE9BQU9BLFVBQVU7SUFDbEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDekJBLElBQUF2QixRQUFBLEdBQUFDLE9BQUE7SUFDQSxJQUFBSSxFQUFBLEdBQUFKLE9BQUE7SUFDQSxJQUFBd0IsSUFBQSxHQUFBeEIsT0FBQTtJQUNBLElBQUFFLFlBQUEsR0FBQUYsT0FBQTtJQUNBLElBQUFHLEVBQUEsR0FBQUgsT0FBQTtJQUNBLElBQUFLLElBQUEsR0FBQUwsT0FBQTtJQUVNLE1BQU95QixhQUFhO01BQ2hCQyxHQUFHO01BQ0hoQixPQUFPO01BRWZpQixZQUFBO1FBQ0UsSUFBSSxDQUFDRCxHQUFHLEdBQUcsSUFBQUYsSUFBQSxDQUFBSSxhQUFhLEVBQUMxQixZQUFBLENBQUFaLGNBQWMsQ0FBQztRQUN4QyxJQUFJLENBQUNvQixPQUFPLEdBQUcsSUFBSVgsUUFBQSxDQUFBWSxPQUFPLEVBQUU7TUFDOUI7TUFFQSxNQUFNa0IsTUFBTUEsQ0FBQ3hCLElBQVksRUFBRWdCLFdBQW1CO1FBQzVDLE1BQU1ULFVBQVUsR0FBR1YsWUFBQSxDQUFBWixjQUFjLENBQUNJLGFBQWE7UUFDL0MsTUFBTSxJQUFJLENBQUNnQixPQUFPLENBQUNHLE1BQU0sQ0FBQ0QsVUFBVSxDQUFDLENBQUNpQixNQUFNLENBQUN4QixJQUFJLEVBQUU7VUFBRWdCO1FBQVcsQ0FBRSxDQUFDO1FBRW5FLE9BQU9BLFdBQVc7TUFDcEI7TUFFQSxNQUFNUyxLQUFLQSxDQUFDQyxZQUFZLEVBQUVDLFFBQWdCLEVBQUVDLElBQUEsR0FBZSxFQUFFO1FBQzNELE1BQU1yQixVQUFVLEdBQUdWLFlBQUEsQ0FBQVosY0FBYyxDQUFDSSxhQUFhO1FBQy9DLE1BQU15QixJQUFJLEdBQUcsSUFBSSxDQUFDVCxPQUFPLENBQUNHLE1BQU0sQ0FBQ0QsVUFBVSxDQUFDLENBQUNPLElBQUksQ0FBQ2EsUUFBUSxDQUFDO1FBQzNELE1BQU1sQixZQUFZLEdBQUdULElBQUksQ0FBQ1UsSUFBSSxDQUFDWCxFQUFFLENBQUNZLE1BQU0sRUFBRSxFQUFFaUIsSUFBSSxDQUFDO1FBQ2pEOUIsRUFBRSxDQUFDK0IsUUFBUSxDQUFDQyxTQUFTLENBQUNyQixZQUFZLEVBQUVpQixZQUFZLENBQUNLLE1BQU0sQ0FBQztRQUV4RCxPQUFPLElBQUksQ0FBQ1AsTUFBTSxDQUFDZixZQUFZLEVBQUVrQixRQUFRLENBQUM7TUFDNUM7O0lBQ0RsQyxPQUFBLENBQUEyQixhQUFBLEdBQUFBLGFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDL0JELElBQUExQixRQUFBLEdBQUFDLE9BQUE7SUFFQTtJQUNBLE1BQU1VLE9BQU8sR0FBRyxJQUFJWCxRQUFBLENBQUFZLE9BQU8sRUFBRTtJQUN0QixlQUFlMEIsdUJBQXVCQSxDQUFDekIsVUFBVSxFQUFFMEIsVUFBVTtNQUNuRSxJQUFJO1FBQ0gsTUFBTXpCLE1BQU0sR0FBR0gsT0FBTyxDQUFDRyxNQUFNLENBQUNELFVBQVUsQ0FBQztRQUV6QztRQUNBLE1BQU0yQixZQUFZLEdBQUcsTUFBTTFCLE1BQU0sQ0FBQ00sSUFBSSxDQUFDbUIsVUFBVSxDQUFDLENBQUNFLE1BQU0sRUFBRTtRQUUzRCxJQUFJRCxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckI7UUFDQSxPQUFPMUIsTUFBTSxDQUFDTSxJQUFJLENBQUNtQixVQUFVLENBQUMsQ0FBQ0csSUFBSSxDQUFDLEVBQUUsQ0FBQztPQUN2QyxDQUFDLE9BQU9DLEdBQUcsRUFBRTtRQUNiekIsT0FBTyxDQUFDMEIsS0FBSyxDQUFDLHdCQUF3QixFQUFFRCxHQUFHLENBQUM7O0lBRTlDOzs7Ozs7Ozs7Ozs7Ozs7OztJQ2hCQSxJQUFBM0MsUUFBQSxHQUFBQyxPQUFBO0lBQ0EsSUFBQUMsS0FBQSxHQUFBRCxPQUFBO0lBQ0EsSUFBQXdCLElBQUEsR0FBQXhCLE9BQUE7SUFDQSxJQUFBRSxZQUFBLEdBQUFGLE9BQUE7SUFKQTs7SUFNQTtJQUNBLE1BQU0sV0FBWTBCLEdBQUcsR0FBRyxJQUFBRixJQUFBLENBQUFJLGFBQWEsRUFBQzFCLFlBQUEsQ0FBQVosY0FBYyxDQUFDO0lBQ3JEO0lBRUEsTUFBTW9CLE9BQU8sR0FBRyxJQUFJWCxRQUFBLENBQUFZLE9BQU8sRUFBRTtJQUV0QixlQUFlaUMsVUFBVUEsQ0FBQ1IsTUFBYyxFQUFFSixRQUFnQjtNQUNoRTtNQUNBLE1BQU1wQixVQUFVLEdBQUdWLFlBQUEsQ0FBQVosY0FBYyxDQUFDSSxhQUFhO01BQy9DLE1BQU15QixJQUFJLEdBQUdULE9BQU8sQ0FBQ0csTUFBTSxDQUFDRCxVQUFVLENBQUMsQ0FBQ08sSUFBSSxDQUFDYSxRQUFRLENBQUM7TUFDdEQsTUFBTXhCLE9BQU8sR0FBRyxJQUFJUCxLQUFBLENBQUFRLGNBQWMsRUFBRTtNQUNwQyxNQUFNb0MsV0FBVyxHQUFHMUIsSUFBSSxDQUFDMkIsaUJBQWlCLENBQUM7UUFDMUM7UUFDQUMsSUFBSSxFQUFFLElBQUk7UUFDVjtRQUNBO1FBQ0FDLFFBQVEsRUFBRTtVQUNUQyxZQUFZLEVBQUU7O09BRWYsQ0FBQztNQUVGSixXQUFXLENBQUNmLEtBQUssQ0FBQ00sTUFBTSxDQUFDO01BQ3pCUyxXQUFXLENBQUNLLEVBQUUsQ0FBQyxPQUFPLEVBQUVqRCxLQUFBLENBQUFRLGNBQWMsQ0FBQzBDLE1BQU0sQ0FBQztNQUM5Q04sV0FBVyxDQUFDSyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQUs7UUFDN0JqRCxLQUFBLENBQUFRLGNBQWMsQ0FBQzJDLE9BQU8sRUFBRTtNQUN6QixDQUFDLENBQUM7TUFDRlAsV0FBVyxDQUFDUSxHQUFHLENBQUNqQixNQUFNLENBQUM7TUFFdkJuQixPQUFPLENBQUNDLEdBQUcsQ0FBQyxHQUFHYyxRQUFRLGdCQUFnQnBCLFVBQVUsR0FBRyxDQUFDO0lBQ3REOzs7Ozs7Ozs7Ozs7Ozs7OztJQ25DQSxJQUFBMEMsT0FBQSxHQUFBdEQsT0FBQTtJQUNBLElBQUF1RCxVQUFBLEdBQUF2RCxPQUFBO0lBQ0EsSUFBQXdELEtBQUEsR0FBQXhELE9BQUE7SUFDQSxJQUFBeUQsTUFBQSxHQUFBekQsT0FBQTtJQUVPO0lBQVUsU0FDUjBELE1BQU1BLENBQUNoQyxHQUFHO01BQ2pCQSxHQUFHLENBQUNpQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxLQUFLQSxHQUFHLENBQUNDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO01BQzNEcEMsR0FBRyxDQUFDaUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFSCxLQUFBLENBQUFPLElBQUksQ0FBQztNQUNqQ3JDLEdBQUcsQ0FBQ2lDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRUYsTUFBQSxDQUFBTyxhQUFhLENBQUM7TUFDeEQsSUFBSVYsT0FBQSxDQUFBVyxhQUFhLENBQUN2QyxHQUFHLENBQUM7TUFDdEIsSUFBSTZCLFVBQUEsQ0FBQVcsaUJBQWlCLENBQUN4QyxHQUFHLENBQUM7SUFDNUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ1pBLElBQUF5QyxNQUFBLEdBQUFuRSxPQUFBO0lBRUEsSUFBQUMsS0FBQSxHQUFBRCxPQUFBO0lBQ0EsSUFBQW9FLEdBQUEsR0FBQXBFLE9BQUE7SUFDQSxJQUFBcUUsS0FBQSxHQUFBckUsT0FBQTtJQUNBLElBQUFJLEVBQUEsR0FBQUosT0FBQTtJQUNBLElBQUFLLElBQUEsR0FBQUwsT0FBQTtJQUNBO0lBRU8sZUFBZXNFLFdBQVdBLENBQUNDLGFBQXFCLEVBQUVDLFlBQW9CO01BQzNFLE1BQU1oRSxPQUFPLEdBQUcsSUFBSVAsS0FBQSxDQUFBUSxjQUFjLEVBQUU7TUFDcEM7TUFDQSxNQUFNZ0UsY0FBYyxHQUFHLEdBQUdGLGFBQWEsQ0FBQ0csS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJRixZQUFZLEVBQUU7TUFFdkVMLE1BQU0sQ0FBQ0ksYUFBYSxDQUFDLENBQ2xCSSxNQUFNLENBQUNGLGNBQWMsQ0FBQyxDQUN0QnZCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsWUFBVztRQUNwQjtRQUNBLE1BQU1rQixHQUFBLENBQUFsQyxRQUFFLENBQUMwQyxNQUFNLENBQUNMLGFBQWEsQ0FBQztRQUM5Qi9ELE9BQU8sQ0FBQzRDLE9BQU8sQ0FBQ3FCLGNBQWMsQ0FBQztNQUNqQyxDQUFDLENBQUMsQ0FDRHZCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTVIsR0FBRyxJQUFHO1FBQ3ZCekIsT0FBTyxDQUFDQyxHQUFHLENBQUN3QixHQUFHLENBQUM7UUFDaEJsQyxPQUFPLENBQUMyQyxNQUFNLENBQUNULEdBQUcsQ0FBQztNQUNyQixDQUFDLENBQUMsQ0FDRG1DLEdBQUcsRUFBRTtNQUVSLE9BQU9yRSxPQUEwQjtJQUNuQztJQUVPLGVBQWVzRSxjQUFjQSxDQUFDMUMsTUFBVyxFQUFFb0MsWUFBb0I7TUFDcEU7TUFDQSxNQUFNaEUsT0FBTyxHQUFHLElBQUlQLEtBQUEsQ0FBQVEsY0FBYyxFQUFFO01BQ3BDO01BQ0EsTUFBTXNFLE9BQU8sR0FBRzNFLEVBQUUsQ0FBQ1ksTUFBTSxFQUFFO01BQzNCLE1BQU1nRSxnQkFBZ0IsR0FBRzNFLElBQUksQ0FBQ1UsSUFBSSxDQUFDZ0UsT0FBTyxFQUFFLEdBQUcsSUFBQVYsS0FBQSxDQUFBWSxFQUFNLEdBQUUsRUFBRSxDQUFDO01BQzFELE1BQU1DLGNBQWMsR0FBRzdFLElBQUksQ0FBQ1UsSUFBSSxDQUFDZ0UsT0FBTyxFQUFFLEdBQUcsSUFBQVYsS0FBQSxDQUFBWSxFQUFNLEdBQUUsSUFBSVQsWUFBWSxFQUFFLENBQUM7TUFDeEU7TUFDQXZELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLEdBQUcsRUFBRWtCLE1BQU0sQ0FBQztNQUN4QixNQUFNZ0MsR0FBQSxDQUFBbEMsUUFBRSxDQUFDQyxTQUFTLENBQUM2QyxnQkFBZ0IsRUFBRTVDLE1BQU0sQ0FBQztNQUU1QztNQUNBK0IsTUFBTSxDQUFDYSxnQkFBZ0IsQ0FBQyxDQUNyQkwsTUFBTSxDQUFDTyxjQUFjLENBQUMsQ0FDdEJoQyxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQVc7UUFDcEIxQyxPQUFPLENBQUM0QyxPQUFPLENBQUM4QixjQUFjLENBQUM7TUFDakMsQ0FBQyxDQUFDLENBQ0RoQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU1SLEdBQUcsSUFBRztRQUN2QjtRQUNBekIsT0FBTyxDQUFDQyxHQUFHLENBQUMsRUFBRSxFQUFFd0IsR0FBRyxDQUFDO1FBQ3BCLE1BQU0wQixHQUFBLENBQUFsQyxRQUFFLENBQUMwQyxNQUFNLENBQUNJLGdCQUFnQixDQUFDO1FBQ2pDLE1BQU1aLEdBQUEsQ0FBQWxDLFFBQUUsQ0FBQzBDLE1BQU0sQ0FBQ00sY0FBYyxDQUFDO1FBRS9CMUUsT0FBTyxDQUFDMkMsTUFBTSxDQUFDVCxHQUFHLENBQUM7TUFDckIsQ0FBQyxDQUFDLENBQ0RtQyxHQUFHLEVBQUU7TUFFUixPQUFPckUsT0FBMEI7SUFDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDMURBLElBQUFMLEVBQUEsR0FBQUgsT0FBQTtJQUNBLElBQUFtRixLQUFBLEdBQUFuRixPQUFBO0lBQ0EsTUFBTW9GLE9BQU8sR0FBRyxJQUFBRCxLQUFBLENBQUFwRSxJQUFJLEVBQUNzRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBRXBDLE1BQU1yQixhQUFhLEdBQUdBLENBQUNKLEdBQUcsRUFBRUMsR0FBRyxLQUFJO01BQ3hDLE1BQU07UUFBRXlCLE9BQU87UUFBRUM7TUFBUyxDQUFFLEdBQUczQixHQUFHLENBQUM0QixNQUFNO01BQ3pDLE1BQU1DLFVBQVUsR0FBRyxJQUFBTixLQUFBLENBQUFwRSxJQUFJLEVBQUNxRSxPQUFPLEVBQUVFLE9BQU8sRUFBRSxPQUFPLEVBQUVDLFNBQVMsQ0FBQyxDQUFDLENBQUM7TUFDL0QsSUFBSSxDQUFDcEYsRUFBRSxDQUFDdUYsVUFBVSxDQUFDRCxVQUFVLENBQUMsRUFBRTtRQUM5QjVCLEdBQUcsQ0FBQzhCLElBQUksQ0FBQztVQUFFQyxNQUFNLEVBQUUsSUFBSTtVQUFFQyxTQUFTLEVBQUU7UUFBRSxDQUFFLENBQUM7UUFDekM7O01BR0YxRixFQUFFLENBQUMyRixPQUFPLENBQUNMLFVBQVUsRUFBRSxDQUFDL0MsR0FBRyxFQUFFcUQsS0FBSyxLQUFJO1FBQ3BDLElBQUlyRCxHQUFHLEVBQUU7VUFDUDtVQUNBekIsT0FBTyxDQUFDMEIsS0FBSyxDQUFDRCxHQUFHLENBQUM7VUFDbEJtQixHQUFHLENBQUMrQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNELElBQUksQ0FBQztZQUFFQyxNQUFNLEVBQUUsS0FBSztZQUFFakQsS0FBSyxFQUFFO1VBQXVCLENBQUUsQ0FBQztTQUN4RSxNQUFNO1VBQ0xrQixHQUFHLENBQUM4QixJQUFJLENBQUM7WUFBRUMsTUFBTSxFQUFFLElBQUk7WUFBRUMsU0FBUyxFQUFFRTtVQUFLLENBQUUsQ0FBQzs7TUFFaEQsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUFDakcsT0FBQSxDQUFBa0UsYUFBQSxHQUFBQSxhQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ3JCSSxTQUFVZ0Msa0JBQWtCQSxDQUFDQyxRQUFnQjtNQUNsRCxNQUFNQyxHQUFHLEdBQUcsSUFBSUMsSUFBSSxFQUFFO01BQ3RCLE1BQU1DLElBQUksR0FBR0YsR0FBRyxDQUFDRyxXQUFXLEVBQUU7TUFDOUIsTUFBTUMsS0FBSyxHQUFHSixHQUFHLENBQUNLLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ2xDLE1BQU1DLEdBQUcsR0FBR04sR0FBRyxDQUFDTyxPQUFPLEVBQUU7TUFDekIsTUFBTUMsS0FBSyxHQUFHUixHQUFHLENBQUNTLFFBQVEsRUFBRTtNQUM1QixNQUFNQyxPQUFPLEdBQUdWLEdBQUcsQ0FBQ1csVUFBVSxFQUFFO01BQ2hDLE1BQU1DLE9BQU8sR0FBR1osR0FBRyxDQUFDYSxVQUFVLEVBQUU7TUFFaEM7TUFDQSxNQUFNQyxXQUFXLEdBQUdWLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHQSxLQUFLLEdBQUdBLEtBQUs7TUFDcEQsTUFBTVcsU0FBUyxHQUFHVCxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBR0EsR0FBRyxHQUFHQSxHQUFHO01BQzVDLE1BQU1VLFdBQVcsR0FBR1IsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUdBLEtBQUssR0FBR0EsS0FBSztNQUNwRCxNQUFNUyxhQUFhLEdBQUdQLE9BQU8sR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHQSxPQUFPLEdBQUdBLE9BQU87TUFDNUQsTUFBTVEsYUFBYSxHQUFHTixPQUFPLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBR0EsT0FBTyxHQUFHQSxPQUFPO01BRTVELE1BQU1PLFNBQVMsR0FBRyxHQUFHakIsSUFBSSxHQUFHWSxXQUFXLEdBQUdDLFNBQVMsR0FBR0MsV0FBVyxHQUFHQyxhQUFhLEdBQUdDLGFBQWEsRUFBRTtNQUVuRyxPQUFPLEdBQUduQixRQUFRLElBQUlvQixTQUFTLEVBQUU7SUFDbEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDbkJBLElBQUFsQyxLQUFBLEdBQUFuRixPQUFBO0lBQ0EsSUFBQUcsRUFBQSxHQUFBSCxPQUFBO0lBQ0EsTUFBTW9GLE9BQU8sR0FBRyxJQUFBRCxLQUFBLENBQUFwRSxJQUFJLEVBQUNzRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBQ3BDLE1BQU10QixJQUFJLEdBQUdBLENBQUNILEdBQUcsRUFBRUMsR0FBRyxLQUFJO01BQ2hDLE1BQU0wQixTQUFTLEdBQUczQixHQUFHLENBQUM0QixNQUFNLENBQUNELFNBQVM7TUFDdEMsSUFBSSxDQUFDQSxTQUFTLEVBQUU7UUFDZjFCLEdBQUcsQ0FBQytCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzlCLElBQUksQ0FBQywwQ0FBMEMsQ0FBQzs7TUFHakUsTUFBTXdELE1BQU0sR0FBRyxJQUFBbkMsS0FBQSxDQUFBcEUsSUFBSSxFQUFDcUUsT0FBTyxFQUFFRyxTQUFTLENBQUM7TUFDdkMsSUFBSSxDQUFDcEYsRUFBRSxDQUFDdUYsVUFBVSxDQUFDNEIsTUFBTSxDQUFDLEVBQUU7UUFDM0IsT0FBT3pELEdBQUcsQ0FBQ0MsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7TUFHcEIzRCxFQUFFLENBQUMyRixPQUFPLENBQUN3QixNQUFNLEVBQUUsQ0FBQzVFLEdBQUcsRUFBRXFELEtBQUssS0FBSTtRQUNqQyxJQUFJckQsR0FBRyxFQUFFO1VBQ1J6QixPQUFPLENBQUMwQixLQUFLLENBQUNELEdBQUcsQ0FBQzZFLE9BQU8sQ0FBQztVQUMxQjs7UUFHRDFELEdBQUcsQ0FBQ0MsSUFBSSxDQUFDaUMsS0FBSyxDQUFDO01BQ2hCLENBQUMsQ0FBQztJQUNILENBQUM7SUFBQ2pHLE9BQUEsQ0FBQWlFLElBQUEsR0FBQUEsSUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUN0QkYsSUFBQTVELEVBQUEsR0FBQUgsT0FBQTtJQUNBLElBQUFtRixLQUFBLEdBQUFuRixPQUFBO0lBQ0EsSUFBQXdILFVBQUEsR0FBQXhILE9BQUE7SUFFQSxJQUFBeUgsUUFBQSxHQUFBekgsT0FBQTtJQUNBLElBQUEwSCxhQUFBLEdBQUExSCxPQUFBO0lBQ0EsSUFBQTJILE9BQUEsR0FBQTNILE9BQUE7SUFFTyxlQUFlNEgsT0FBT0EsQ0FBQ2hFLEdBQUcsRUFBRUMsR0FBRztNQUNwQyxNQUFNdUIsT0FBTyxHQUFHLElBQUFELEtBQUEsQ0FBQXBFLElBQUksRUFBQ3NFLFNBQVMsRUFBRSxVQUFVLENBQUM7TUFDM0MsTUFBTXdDLElBQUksR0FBR0wsVUFBVSxDQUFDO1FBQUVNLFNBQVMsRUFBRTtNQUFJLENBQUUsQ0FBQztNQUU1Q0QsSUFBSSxDQUFDRSxLQUFLLENBQUNuRSxHQUFHLEVBQUUsT0FBT2xCLEdBQUcsRUFBRXNGLE1BQU0sRUFBRWpDLEtBQUssS0FBSTtRQUMzQyxJQUFJckQsR0FBRyxFQUFFO1VBQ1B6QixPQUFPLENBQUMwQixLQUFLLENBQUNELEdBQUcsQ0FBQzZFLE9BQU8sQ0FBQztVQUMxQixPQUFPMUQsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDLDBCQUEwQixDQUFDOztRQUV6RCxJQUFJLENBQUNrRSxNQUFNLENBQUN6QyxTQUFTLEVBQUU7VUFDckIsT0FBTzFCLEdBQUcsQ0FBQytCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzlCLElBQUksQ0FBQywwRUFBMEUsQ0FBQzs7UUFFekcsSUFBSSxDQUFDa0UsTUFBTSxDQUFDMUMsT0FBTyxFQUFFO1VBQ25CLE9BQU96QixHQUFHLENBQUMrQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUM7O1FBRWpELElBQUksQ0FBQ2lDLEtBQUssQ0FBQ2tDLEtBQUssRUFBRTtVQUNoQixPQUFPcEUsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDO1lBQUU4QixNQUFNLEVBQUUsS0FBSztZQUFFakQsS0FBSyxFQUFFO1VBQXNCLENBQUUsQ0FBQzs7UUFFL0UsTUFBTTtVQUFFc0Y7UUFBSyxDQUFFLEdBQUdsQyxLQUFLO1FBQ3ZCLE1BQU1tQyxrQkFBa0IsR0FBRyxDQUN6QixZQUFZLEVBQ1osWUFBWSxFQUNaLFdBQVcsRUFDWCxXQUFXLEVBQ1gsV0FBVyxFQUNYLGFBQWEsRUFDYixZQUFZLEVBQ1osV0FBVyxFQUNYLFlBQVksRUFDWixZQUFZLENBQ2I7UUFFRCxJQUFJLENBQUNBLGtCQUFrQixDQUFDQyxRQUFRLENBQUNwQyxLQUFLLENBQUNrQyxLQUFLLENBQUNHLFFBQVEsQ0FBQyxFQUFFO1VBQ3RELE9BQU92RSxHQUFHLENBQUMrQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM5QixJQUFJLENBQUMsaUVBQWlFLENBQUM7O1FBR2hHLE1BQU0yQixVQUFVLEdBQUcsSUFBQU4sS0FBQSxDQUFBcEUsSUFBSSxFQUFDcUUsT0FBTyxFQUFFNEMsTUFBTSxDQUFDMUMsT0FBTyxFQUFFMEMsTUFBTSxDQUFDekMsU0FBUyxDQUFDO1FBQ2xFLE1BQU04QyxTQUFTLEdBQUdMLE1BQU0sQ0FBQ3pILFFBQVEsSUFBSTBILEtBQUssQ0FBQ0ssZ0JBQWdCO1FBRTNELE1BQU1yQyxRQUFRLEdBQUdvQyxTQUFTLEdBQUdBLFNBQVMsQ0FBQzNELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTO1FBQ2hFLFNBQVM2RCxnQkFBZ0JBLENBQUN2RyxRQUFnQjtVQUN4QyxNQUFNd0csU0FBUyxHQUFHeEcsUUFBUSxDQUFDMEMsS0FBSyxDQUFDLEdBQUcsQ0FBQztVQUNyQyxPQUFPOEQsU0FBUyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxHQUFHRCxTQUFTLENBQUNBLFNBQVMsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUk7UUFDdEU7UUFFQSxNQUFNbEksUUFBUSxHQUFHLEdBQUcsSUFBQW1ILGFBQUEsQ0FBQTFCLGtCQUFrQixFQUFDQyxRQUFRLENBQUMsSUFBSXNDLGdCQUFnQixDQUFDRixTQUFTLENBQUMsRUFBRTtRQUNqRixNQUFNSyxJQUFJLEdBQUczQyxLQUFLLENBQUNrQyxLQUFLLENBQUNVLFFBQVE7UUFDakMsTUFBTTlHLE1BQU0sR0FBRyxJQUFBc0QsS0FBQSxDQUFBcEUsSUFBSSxFQUFDMEUsVUFBVSxFQUFFbEYsUUFBUSxDQUFDO1FBRXpDLElBQUk7VUFDRixNQUFNSixFQUFFLENBQUMrQixRQUFRLENBQUMwRyxLQUFLLENBQUNuRCxVQUFVLEVBQUU7WUFBRW9ELFNBQVMsRUFBRTtVQUFJLENBQUUsQ0FBQztVQUN4RCxNQUFNMUksRUFBRSxDQUFDK0IsUUFBUSxDQUFDNEcsUUFBUSxDQUFDSixJQUFJLEVBQUU3RyxNQUFNLENBQUM7VUFDeEMsTUFBTTFCLEVBQUUsQ0FBQytCLFFBQVEsQ0FBQzBDLE1BQU0sQ0FBQzhELElBQUksQ0FBQztVQUM5QixNQUFNSyxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUM7VUFFbkMsSUFBSUEsV0FBVyxDQUFDWixRQUFRLENBQUNGLEtBQUssQ0FBQ0csUUFBUSxDQUFDLEVBQUU7WUFDeEMsTUFBTSxJQUFBWCxRQUFBLENBQUFuRCxXQUFXLEVBQUN6QyxNQUFNLEVBQUUsS0FBSyxDQUFDOztVQUVsQ1osT0FBTyxDQUFDQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRVcsTUFBTSxDQUFDO1VBQ3BDLE1BQU0sSUFBQThGLE9BQUEsQ0FBQS9FLFVBQVUsRUFBQ2YsTUFBTSxDQUFDO1VBQ3hCZ0MsR0FBRyxDQUFDOEIsSUFBSSxDQUFDO1lBQ1BDLE1BQU0sRUFBRSxJQUFJO1lBQ1oyQixPQUFPLEVBQUUsNEJBQTRCO1lBQ3JDcEcsSUFBSSxFQUFFLElBQUFnRSxLQUFBLENBQUFwRSxJQUFJLEVBQUNpSCxNQUFNLENBQUMxQyxPQUFPLEVBQUUwQyxNQUFNLENBQUN6QyxTQUFTLEVBQUVoRixRQUFRO1dBQ3RELENBQUM7U0FDSCxDQUFDLE9BQU9vQyxLQUFLLEVBQUU7VUFDZDFCLE9BQU8sQ0FBQzBCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDNEUsT0FBTyxDQUFDO1VBQzVCMUQsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDOztNQUU3QyxDQUFDLENBQUM7SUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7SUM5RUEsSUFBQXFCLEtBQUEsR0FBQW5GLE9BQUE7SUFDQSxJQUFBZ0osTUFBQSxHQUFBaEosT0FBQTtJQUNBLElBQUF5SCxRQUFBLEdBQUF6SCxPQUFBO0lBQ0EsSUFBQTBILGFBQUEsR0FBQTFILE9BQUE7SUFDQSxJQUFBaUosS0FBQSxHQUFBakosT0FBQTtJQUNBLElBQUFrSixJQUFBLEdBQUFsSixPQUFBO0lBRU0sTUFBT2lFLGFBQWE7TUFDeEIsQ0FBQXZDLEdBQUk7TUFDSixDQUFBeUgsR0FBSTtNQUNKLENBQUFDLFFBQVM7TUFDVCxDQUFBbEIsa0JBQW1CLEdBQUcsQ0FDcEIsWUFBWSxFQUNaLFlBQVksRUFDWixXQUFXLEVBQ1gsV0FBVyxFQUNYLFdBQVcsRUFDWCxhQUFhLEVBQ2IsWUFBWSxFQUNaLFdBQVcsRUFDWCxZQUFZLEVBQ1osWUFBWSxDQUNiO01BQ0R2RyxZQUFZRCxHQUFHO1FBQ2IsSUFBSSxDQUFDLENBQUFBLEdBQUksR0FBR0EsR0FBRztRQUNmLElBQUksQ0FBQyxDQUFBMEgsUUFBUyxHQUFHSixNQUFNO1FBQ3ZCLElBQUksQ0FBQyxDQUFBSSxRQUFTLEdBQUdKLE1BQU0sQ0FBQztVQUN0QnRJLE9BQU8sRUFBRXNJLE1BQU0sQ0FBQ0ssV0FBVyxDQUFDO1lBQzFCaEksV0FBVyxFQUFFLFNBQVM7WUFDdEJXLFFBQVEsRUFBRSxJQUFJLENBQUNzSDtXQUNoQjtTQUNGLENBQUM7UUFDRixJQUFJLENBQUMsQ0FBQUgsR0FBSSxHQUFHLElBQUlELElBQUEsQ0FBQUssU0FBUyxFQUFFO1FBQzNCLElBQUksQ0FBQyxDQUFBN0gsR0FBSSxDQUFDOEgsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQUosUUFBUyxDQUFDSyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDNUgsTUFBTSxDQUFDO01BQ3hFO01BRUF5SCxPQUFPLEdBQUdBLENBQUMxRixHQUFZLEVBQUV6QyxJQUFpQixFQUFFdUksRUFBbUQsS0FBSTtRQUNqRyxNQUFNekgsSUFBSSxHQUFHLEdBQUcsSUFBQXlGLGFBQUEsQ0FBQTFCLGtCQUFrQixFQUFDN0UsSUFBSSxDQUFDd0ksWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDQyxZQUFZLENBQUN6SSxJQUFJLENBQUNpSCxRQUFRLENBQUMsRUFBRTtRQUMxRnNCLEVBQUUsQ0FBQyxJQUFJLEVBQUV6SCxJQUFJLENBQUM7TUFDaEIsQ0FBQztNQUNEMkgsWUFBWUEsQ0FBQ0MsUUFBZ0I7UUFDM0IsUUFBUUEsUUFBUTtVQUNkLEtBQUssWUFBWTtZQUNmLE9BQU8sTUFBTTtVQUNmLEtBQUssV0FBVztZQUNkLE9BQU8sTUFBTTtVQUNmLEtBQUssV0FBVztZQUNkLE9BQU8sTUFBTTtVQUNmLEtBQUssV0FBVztZQUNkLE9BQU8sTUFBTTtVQUNmLEtBQUssWUFBWTtZQUNmLE9BQU8sT0FBTztVQUNoQjtZQUNFLE9BQU8sSUFBSTs7TUFFakI7TUFFQWhJLE1BQU0sR0FBRyxNQUFBQSxDQUFPK0IsR0FBRyxFQUFFQyxHQUFHLEtBQUk7UUFDMUIsSUFBSSxDQUFDRCxHQUFHLENBQUN6QyxJQUFJLEVBQUU7VUFDYixPQUFPMEMsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDO1lBQUU4QixNQUFNLEVBQUUsS0FBSztZQUFFakQsS0FBSyxFQUFFO1VBQXNCLENBQUUsQ0FBQzs7UUFHL0UsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBdUYsa0JBQW1CLENBQUNDLFFBQVEsQ0FBQ3ZFLEdBQUcsQ0FBQ3pDLElBQUksQ0FBQ2lILFFBQVEsQ0FBQyxFQUFFO1VBQ3pELE9BQU92RSxHQUFHLENBQUMrQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM5QixJQUFJLENBQUMsaUVBQWlFLENBQUM7O1FBR2hHLElBQUk7VUFDRixJQUFJZ0csU0FBUztVQUNiLE1BQU1mLFdBQVcsR0FBRyxDQUFDLGFBQWEsQ0FBQztVQUNuQyxNQUFNZ0IsV0FBVyxHQUFHLElBQUlkLEtBQUEsQ0FBQXhILGFBQWEsRUFBRTtVQUN2QyxNQUFNUSxJQUFJLEdBQUcsR0FBRyxJQUFBeUYsYUFBQSxDQUFBMUIsa0JBQWtCLEVBQUNwQyxHQUFHLENBQUN6QyxJQUFJLENBQUN3SSxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUNDLFlBQVksQ0FBQ2hHLEdBQUcsQ0FBQ3pDLElBQUksQ0FBQ2lILFFBQVEsQ0FBQyxFQUFFO1VBQ2xHLE1BQU00QixJQUFJLEdBQUcsR0FBR3BHLEdBQUcsQ0FBQ3FHLElBQUksQ0FBQzFFLFNBQVMsR0FBR0osS0FBQSxDQUFBK0UsR0FBRyxHQUFHakksSUFBSSxFQUFFO1VBRWpELElBQUk4RyxXQUFXLENBQUNaLFFBQVEsQ0FBQ3ZFLEdBQUcsQ0FBQ3pDLElBQUksQ0FBQ2lILFFBQVEsQ0FBQyxFQUFFO1lBQzNDLE1BQU0rQixpQkFBaUIsR0FBRyxNQUFNLElBQUExQyxRQUFBLENBQUFuRCxXQUFXLEVBQUNWLEdBQUcsQ0FBQ3pDLElBQUksQ0FBQ2QsSUFBSSxFQUFFLEtBQUssQ0FBQztZQUNqRXlKLFNBQVMsR0FBRyxNQUFNQyxXQUFXLENBQUNsSSxNQUFNLENBQUNzSSxpQkFBaUIsRUFBRUgsSUFBSSxDQUFDO1dBQzlELE1BQU1GLFNBQVMsR0FBRyxNQUFNQyxXQUFXLENBQUNsSSxNQUFNLENBQUMrQixHQUFHLENBQUN6QyxJQUFJLENBQUNkLElBQUksRUFBRTJKLElBQUksQ0FBQztVQUVoRSxNQUFNSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQWpCLEdBQUksQ0FBQ2tCLGFBQWEsQ0FBQ1AsU0FBUyxDQUFDO1VBQ3pELElBQUksQ0FBQ00sUUFBUSxDQUFDeEUsTUFBTSxFQUFFO1lBQ3BCL0IsR0FBRyxDQUFDOEIsSUFBSSxDQUFDO2NBQ1BDLE1BQU0sRUFBRSxLQUFLO2NBQ2JqRCxLQUFLLEVBQUUsc0JBQXNCeUgsUUFBUSxDQUFDekgsS0FBSzthQUM1QyxDQUFDO1lBQ0Y7O1VBRUZrQixHQUFHLENBQUM4QixJQUFJLENBQUM7WUFDUEMsTUFBTSxFQUFFLElBQUk7WUFDWjJCLE9BQU8sRUFBRSw0QkFBNEI7WUFDckNwRyxJQUFJLEVBQUU2SSxJQUFJO1lBQ1ZLLGFBQWEsRUFBRUQsUUFBUSxDQUFDRTtXQUN6QixDQUFDO1NBQ0gsQ0FBQyxPQUFPM0gsS0FBSyxFQUFFO1VBQ2QxQixPQUFPLENBQUMwQixLQUFLLENBQUNBLEtBQUssQ0FBQztVQUNwQmtCLEdBQUcsQ0FBQytCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzlCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQzs7TUFFN0MsQ0FBQzs7SUFDRmhFLE9BQUEsQ0FBQW1FLGFBQUEsR0FBQUEsYUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNqR0QsSUFBQWtCLEtBQUEsR0FBQW5GLE9BQUE7SUFDQSxJQUFBZ0osTUFBQSxHQUFBaEosT0FBQTtJQUNBLElBQUEwSCxhQUFBLEdBQUExSCxPQUFBO0lBQ0EsSUFBQWlKLEtBQUEsR0FBQWpKLE9BQUE7SUFDQSxJQUFBa0osSUFBQSxHQUFBbEosT0FBQTtJQUVNLE1BQU9rRSxpQkFBaUI7TUFDNUIsQ0FBQXhDLEdBQUk7TUFDSixDQUFBeUgsR0FBSTtNQUNKLENBQUFDLFFBQVM7TUFFVHpILFlBQVlELEdBQUc7UUFDYixJQUFJLENBQUMsQ0FBQUEsR0FBSSxHQUFHQSxHQUFHO1FBQ2YsSUFBSSxDQUFDLENBQUF5SCxHQUFJLEdBQUcsSUFBSUQsSUFBQSxDQUFBcUIsUUFBUSxFQUFFO1FBQzFCLElBQUksQ0FBQyxDQUFBbkIsUUFBUyxHQUFHSixNQUFNLENBQUM7VUFDdEJ0SSxPQUFPLEVBQUVzSSxNQUFNLENBQUNLLFdBQVcsQ0FBQztZQUMxQmhJLFdBQVcsRUFBRSxTQUFTO1lBQ3RCVyxRQUFRLEVBQUUsSUFBSSxDQUFDc0g7V0FDaEI7U0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLENBQUE1SCxHQUFJLENBQUM4SCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUFKLFFBQVMsQ0FBQ29CLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMzSSxNQUFNLENBQUM7TUFDaEY7TUFFQStILFlBQVlBLENBQUNDLFFBQWdCO1FBQzNCLFFBQVFBLFFBQVE7VUFDZCxLQUFLLFlBQVk7WUFDZixPQUFPLE1BQU07VUFDZixLQUFLLGlCQUFpQjtZQUNwQixPQUFPLE1BQU07VUFDZixLQUFLLG9CQUFvQjtZQUN2QixPQUFPLE1BQU07VUFDZixLQUFLLHlFQUF5RTtZQUM1RSxPQUFPLE9BQU87VUFDaEIsS0FBSywwQkFBMEI7WUFDN0IsT0FBTyxNQUFNO1VBQ2YsS0FBSyxtRUFBbUU7WUFDdEUsT0FBTyxPQUFPO1VBQ2hCLEtBQUssK0JBQStCO1lBQ2xDLE9BQU8sTUFBTTtVQUNmLEtBQUssMkVBQTJFO1lBQzlFLE9BQU8sT0FBTztVQUNoQixLQUFLLGlCQUFpQjtZQUNwQixPQUFPLE1BQU07VUFDZjtZQUNFLE9BQU8sSUFBSTs7TUFFakI7TUFFQVAsT0FBTyxHQUFHQSxDQUFDMUYsR0FBWSxFQUFFekMsSUFBaUIsRUFBRXVJLEVBQW1ELEtBQUk7UUFDakcsTUFBTXpILElBQUksR0FBRyxHQUFHLElBQUF5RixhQUFBLENBQUExQixrQkFBa0IsRUFBQzdFLElBQUksQ0FBQ3dJLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxDQUFDekksSUFBSSxDQUFDaUgsUUFBUSxDQUFDLEVBQUU7UUFDMUZzQixFQUFFLENBQUMsSUFBSSxFQUFFekgsSUFBSSxDQUFDO01BQ2hCLENBQUM7TUFFREosTUFBTSxHQUFHLE1BQUFBLENBQU8rQixHQUFHLEVBQUVDLEdBQUcsS0FBSTtRQUMxQixJQUFJLENBQUNELEdBQUcsQ0FBQ21DLEtBQUssQ0FBQzBDLE1BQU0sRUFBRTtVQUNyQixPQUFPNUUsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDO1lBQUU4QixNQUFNLEVBQUUsS0FBSztZQUFFakQsS0FBSyxFQUFFO1VBQXNCLENBQUUsQ0FBQzs7UUFHL0UsSUFBSTtVQUNGO1VBQ0EsTUFBTTtZQUFFMkMsT0FBTztZQUFFQyxTQUFTO1lBQUVrRjtVQUFLLENBQUUsR0FBRzdHLEdBQUcsQ0FBQ3FHLElBQUk7VUFDOUMsS0FBSyxNQUFNOUksSUFBSSxJQUFJdUosTUFBTSxDQUFDQyxNQUFNLENBQUMvRyxHQUFHLENBQUNtQyxLQUFLLENBQUMsRUFBRTtZQUMzQztZQUNBLE1BQU07Y0FBRTFGLElBQUk7Y0FBRXNKLFlBQVk7Y0FBRXZCO1lBQVEsQ0FBRSxHQUFHakgsSUFBSTtZQUU3QyxNQUFNYyxJQUFJLEdBQUcsR0FBRyxJQUFBeUYsYUFBQSxDQUFBMUIsa0JBQWtCLEVBQUMyRCxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUNDLFlBQVksQ0FBQ3hCLFFBQVEsQ0FBQyxFQUFFO1lBQ2hGLE1BQU00QixJQUFJLEdBQUcsR0FBRzFFLE9BQU8sR0FBR0gsS0FBQSxDQUFBK0UsR0FBRyxHQUFHM0UsU0FBUyxHQUFHSixLQUFBLENBQUErRSxHQUFHLEdBQUdPLEtBQUssR0FBR3RGLEtBQUEsQ0FBQStFLEdBQUcsR0FBR2pJLElBQUksRUFBRTtZQUN0RWhCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUMsRUFBRWIsSUFBSSxFQUFFc0osWUFBWSxDQUFDO1lBQ2xDMUksT0FBTyxDQUFDQyxHQUFHLENBQUMsR0FBRyxFQUFFZSxJQUFJLENBQUM7WUFFdEIsTUFBTThILFdBQVcsR0FBRyxJQUFJZCxLQUFBLENBQUF4SCxhQUFhLEVBQUU7WUFDdkMsTUFBTXFJLFNBQVMsR0FBRyxNQUFNQyxXQUFXLENBQUNsSSxNQUFNLENBQUN4QixJQUFJLEVBQUUySixJQUFJLENBQUM7WUFFdEQvSSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxXQUFXLEVBQUU0SSxTQUFTLENBQUM7WUFDbkMsTUFBTSxJQUFJLENBQUMsQ0FBQVgsR0FBSSxDQUFDeUIsTUFBTSxDQUFDZCxTQUFTLENBQUM7O1VBR25DakcsR0FBRyxDQUFDOEIsSUFBSSxDQUFDO1lBQ1BDLE1BQU0sRUFBRSxJQUFJO1lBQ1oyQixPQUFPLEVBQUU7V0FDVixDQUFDO1VBRUY7U0FDRCxDQUFDLE9BQU81RSxLQUFLLEVBQUU7VUFDZDFCLE9BQU8sQ0FBQzBCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO1VBQ3BCa0IsR0FBRyxDQUFDK0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDLHlCQUF5QixDQUFDOztNQUVuRCxDQUFDOztJQUNGaEUsT0FBQSxDQUFBb0UsaUJBQUEsR0FBQUEsaUJBQUEifQ==