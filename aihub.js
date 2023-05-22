"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = exports.AIModel = void 0;
var dependency_0 = require("@beyond-js/backend/client");
var dependency_1 = require("@beyond-js/kernel/bundle");
var dependency_2 = require("@aimpact/backend/api");
const {
  Bundle: __Bundle
} = dependency_1;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/aihub"
  },
  "type": "bridge"
}).package();
;
__pkg.dependencies.update([['@beyond-js/backend/client', dependency_0], ['@aimpact/backend/api', dependency_2]]);
const {
  ActionsBridge
} = brequire('@beyond-js/backend/client');
const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 41406178,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AIModel = void 0;
    var _api = require("@aimpact/backend/api");
    /*actions*/ /*bundle*/
    class AIModel {
      #api = new _api.AIBackend();
      completions(prompt, messages) {
        return this.#api.completions(prompt, messages);
      }
      chat(messages) {
        return this.#api.chatCompletions(messages);
      }
      transcription(blob, lang) {
        return this.#api.transcription(blob, lang);
      }
    }
    exports.AIModel = AIModel;
  }
});
__pkg.exports.descriptor = [{
  "im": "./index",
  "from": "AIModel",
  "name": "AIModel"
}];
let AIModel;

// Module exports
exports.AIModel = AIModel;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'AIModel') && (exports.AIModel = AIModel = require ? require('./index').AIModel : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtJQUdPLFlBQVk7SUFBVSxNQUN2QkEsT0FBTztNQUNYLElBQUksR0FBRyxJQUFJQyxjQUFTLEVBQUU7TUFFdEJDLFdBQVcsQ0FBQ0MsTUFBYyxFQUFFQyxRQUFnQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUNGLFdBQVcsQ0FBQ0MsTUFBTSxFQUFFQyxRQUFRLENBQUM7TUFDaEQ7TUFFQUMsSUFBSSxDQUFDRCxRQUF3QztRQUMzQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUNFLGVBQWUsQ0FBQ0YsUUFBUSxDQUFDO01BQzVDO01BRUFHLGFBQWEsQ0FBQ0MsSUFBVSxFQUFFQyxJQUFZO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQ0YsYUFBYSxDQUFDQyxJQUFJLEVBQUVDLElBQUksQ0FBQztNQUM1Qzs7SUFDREMiLCJuYW1lcyI6WyJBSU1vZGVsIiwiQUlCYWNrZW5kIiwiY29tcGxldGlvbnMiLCJwcm9tcHQiLCJtZXNzYWdlcyIsImNoYXQiLCJjaGF0Q29tcGxldGlvbnMiLCJ0cmFuc2NyaXB0aW9uIiwiYmxvYiIsImxhbmciLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiJFOlxcd29ya3NwYWNlXFxhaW1wYWN0LyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOltudWxsXX0=