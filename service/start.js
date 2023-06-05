"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__beyond_transversal = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@beyond-js/kernel/transversals");
var dependency_2 = require("@beyond-js/backend/listen");
const {
  Transversal
} = brequire('@beyond-js/kernel/transversals');
const __beyond_transversal = new Transversal('start', '');
exports.__beyond_transversal = __beyond_transversal;
__beyond_transversal.dependencies.update([['@beyond-js/kernel/transversals', dependency_1], ['@beyond-js/backend/listen', dependency_2]]);
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
  /***********************
  INTERNAL MODULE: ./start
  ***********************/

  ims.set('./start', {
    hash: 2265977041,
    creator: function (require, exports) {
      "use strict";

      var _listen = require("@beyond-js/backend/listen");
      const port = parseInt(process.env.PORT);
      (0, _listen.listen)(port);
    }
  });
  return {
    dependencies: ['@beyond-js/backend/listen']
  };
}]);
__beyond_transversal.initialise(bundles);