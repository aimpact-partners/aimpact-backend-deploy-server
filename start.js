"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__beyond_transversal = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@beyond-js/kernel/transversals");
var dependency_2 = require("express");
var dependency_3 = require("@aimpact/backend/routes");
var dependency_4 = require("vhost");
var dependency_5 = require("https");
var dependency_6 = require("fs");
var dependency_7 = require("dotenv");
var dependency_8 = require("@beyond-js/backend/listen");
const {
  Transversal
} = brequire('@beyond-js/kernel/transversals');
const __beyond_transversal = new Transversal('start', '');
exports.__beyond_transversal = __beyond_transversal;
__beyond_transversal.dependencies.update([['@beyond-js/kernel/transversals', dependency_1], ['express', dependency_2], ['@aimpact/backend/routes', dependency_3], ['vhost', dependency_4], ['https', dependency_5], ['fs', dependency_6], ['dotenv', dependency_7], ['@beyond-js/backend/listen', dependency_8]]);
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
    hash: 282955686,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Server = void 0;
      var express = require("express");
      var _connections = require("./connections");
      var _routes = require("@aimpact/backend/routes");
      var vhost = require("vhost");
      var https = require("https");
      var _fs = require("fs");
      var dotenv = require("dotenv");
      dotenv.config();
      class Server {
        #instance;
        #connections;
        #app;
        #port = process.env.EXPRESS_PORT;
        #router;
        constructor() {
          this.#start();
        }
        #start() {
          try {
            const app = express();
            this.#setHeader(app);
            this.#router = express.Router();
            (0, _routes.routes)(app);
            //-------------------
            const prod = express();
            let server;
            console.log(1, process.env.NODE_ENV);
            if (process.env.NODE_ENV === "production") {
              // In production, use the process.env.SUBDOMAIN_URL subdomain
              prod.use(vhost(process.env.SUBDOMAIN_URL, app));
              const options = {
                key: (0, _fs.readFileSync)("/etc/letsencrypt/live/dev.backend.aimpact.partners/fullchain.pem"),
                cert: (0, _fs.readFileSync)("/etc/letsencrypt/live/dev.backend.aimpact.partners/privkey.pem")
              };
              server = https.createServer(options, prod).listen(this.#port);
            }
            this.#app = process.env.NODE_ENV === "production" ? prod : app;
            this.#app.use(express.json());
            //-------------------
            this.#instance = process.env.NODE_ENV === "production" ? server : this.#app.listen(this.#port);
            this.#connections = new _connections.Connections(this.#instance);
            //subscription to listen routes module changes.
            _routes.hmr.on("change", this.onChange);
          } catch (exc) {
            console.error("Error", exc);
          }
        }
        #setHeader(app) {
          app.use((req, res, next) => {
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
    dependencies: ['express', '@aimpact/backend/routes', 'vhost', 'https', 'fs', 'dotenv']
  };
}]);

/*************************************
MODULE: @aimpact/backend/start-backend
*************************************/

bundles.push([{
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/start-backend"
  },
  "type": "start"
}, function (ims, exports) {
  /***********************
  INTERNAL MODULE: ./start
  ***********************/

  ims.set('./start', {
    hash: 3995412763,
    creator: function (require, exports) {
      "use strict";

      var _listen = require("@beyond-js/backend/listen");
      var dotenv = require("dotenv");
      /*
       * Initialize library beyondJS backend server
       */

      dotenv.config();
      (0, _listen.listen)(6530);
      console.log(process.env.OPEN_AI_KEY);
    }
  });
  return {
    dependencies: ['@beyond-js/backend/listen', 'dotenv']
  };
}]);
__beyond_transversal.initialise(bundles);