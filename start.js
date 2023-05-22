"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__beyond_transversal = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@beyond-js/kernel/transversals");
var dependency_2 = require("@beyond-js/backend/listen");
var dependency_3 = require("express");
var dependency_4 = require("@aimpact/backend/routes");
var dependency_5 = require("dotenv");
const {
  Transversal
} = brequire('@beyond-js/kernel/transversals');
const __beyond_transversal = new Transversal('start', '');
exports.__beyond_transversal = __beyond_transversal;
__beyond_transversal.dependencies.update([['@beyond-js/kernel/transversals', dependency_1], ['@beyond-js/backend/listen', dependency_2], ['express', dependency_3], ['@aimpact/backend/routes', dependency_4], ['dotenv', dependency_5]]);
const bundles = [];
/******************************
MODULE: @aimpact/backend/server
******************************/

bundles.push([{
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/server"
  },
  "type": "start"
}, function (ims, exports) {
  /*****************************
  INTERNAL MODULE: ./connections
  *****************************/

  ims.set('./connections', {
    hash: 2998543613,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Connections = void 0;
      class Connections {
        #server;
        #connections = new Set();
        #onConnection = conn => this.#connections.add(conn);
        #onDisconnect = conn => this.#connections.delete(conn);
        constructor(server) {
          this.#server = server;
          this.#server.on('connection', this.#onConnection);
          this.#server.on('disconnect', this.#onDisconnect);
        }
        destroy() {
          this.#server.off('connection', this.#onConnection);
          this.#server.off('disconnect', this.#onDisconnect);
          this.#connections.forEach(connection => connection.destroy());
        }
      }
      exports.Connections = Connections;
    }
  });

  /************************
  INTERNAL MODULE: ./server
  ************************/

  ims.set('./server', {
    hash: 3947523807,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Server = void 0;
      var _listen = require("@beyond-js/backend/listen");
      var express = require("express");
      var _connections = require("./connections");
      var _routes = require("@aimpact/backend/routes");
      var dotenv = require("dotenv");
      dotenv.config();
      class Server {
        #instance;
        #connections;
        #app;
        #port = process.env.PORT || 5000;
        #router;
        constructor() {
          this.#start();
        }
        #start() {
          try {
            this.#app = express();
            this.#setHeader();
            this.#router = express.Router();
            (0, _routes.routes)(this.#app);
            this.#app.use(express.json());
            this.#instance = this.#app.listen(this.#port);
            this.#connections = new _connections.Connections(this.#instance);
            (0, _listen.listen)(this.#instance);
            //subscription to listen routes module changes.
            _routes.hmr.on("change", this.onChange);
          } catch (exc) {
            console.error("Error", exc);
          }
        }
        #setHeader() {
          this.#app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
            next();
          });
        }
        onChange = () => {
          this.#connections.destroy();
          this.#instance.close(() => {
            _routes.hmr.off("change", this.onChange);
            this.#start();
          });
        };
      }
      exports.Server = Server;
    }
  });

  /***********************
  INTERNAL MODULE: ./start
  ***********************/

  ims.set('./start', {
    hash: 3654546978,
    creator: function (require, exports) {
      "use strict";

      var _server = require("./server");
      new _server.Server();
    }
  });
  return {
    dependencies: ['@beyond-js/backend/listen', 'express', '@aimpact/backend/routes', 'dotenv']
  };
}]);
__beyond_transversal.initialise(bundles);