"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__beyond_transversal = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@beyond-js/kernel/transversals");
var dependency_2 = require("express");
var dependency_3 = require("@aimpact/http-server/routes");
const {
  Transversal
} = brequire('@beyond-js/kernel/transversals');
const __beyond_transversal = new Transversal('start', '');
exports.__beyond_transversal = __beyond_transversal;
__beyond_transversal.dependencies.update([['@beyond-js/kernel/transversals', dependency_1], ['express', dependency_2], ['@aimpact/http-server/routes', dependency_3]]);
const bundles = [];
/**********************************
MODULE: @aimpact/http-server/server
**********************************/

bundles.push([{
  "module": {
    "vspecifier": "@aimpact/http-server@0.0.1/server"
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
    hash: 491870051,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Server = void 0;
      var express = require("express");
      var _connections = require("./connections");
      var _routes = require("@aimpact/http-server/routes");
      class Server {
        #instance;
        #connections;
        #app;
        #port = 5000;
        #router;
        constructor() {
          this.#start();
        }
        #start() {
          try {
            this.#app = express();
            this.#app.use(express.json());
            this.#setHeader();
            this.#router = express.Router();
            (0, _routes.routes)(this.#app);
            //subscription to listen routes module changes.
            _routes.hmr.on('change', this.onChange);
            this.#instance = this.#app.listen(this.#port);
            this.#connections = new _connections.Connections(this.#instance);
          } catch (exc) {
            console.error('Error', exc);
          }
        }
        #setHeader() {
          this.#app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
          });
        }
        onChange = () => {
          this.#connections.destroy();
          this.#instance.close(() => {
            _routes.hmr.off('change', this.onChange);
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
    dependencies: ['express', '@aimpact/http-server/routes']
  };
}]);
__beyond_transversal.initialise(bundles);