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
  hash: 762336427,
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
      transcription(path, lang) {
        return this.#api.transcription(path, lang);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXBpIiwicmVxdWlyZSIsIkFJTW9kZWwiLCJhcGkiLCJBSUJhY2tlbmQiLCJjb21wbGV0aW9ucyIsInByb21wdCIsIm1lc3NhZ2VzIiwiY2hhdCIsImNoYXRDb21wbGV0aW9ucyIsInRyYW5zY3JpcHRpb24iLCJwYXRoIiwibGFuZyIsImV4cG9ydHMiXSwic291cmNlcyI6WyJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbF0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBLElBQUFBLElBQUEsR0FBQUMsT0FBQTtJQUdPLFlBQVk7SUFBVSxNQUN2QkMsT0FBTztNQUNYLENBQUFDLEdBQUksR0FBRyxJQUFJSCxJQUFBLENBQUFJLFNBQVMsRUFBRTtNQUV0QkMsV0FBV0EsQ0FBQ0MsTUFBYyxFQUFFQyxRQUFnQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxDQUFBSixHQUFJLENBQUNFLFdBQVcsQ0FBQ0MsTUFBTSxFQUFFQyxRQUFRLENBQUM7TUFDaEQ7TUFFQUMsSUFBSUEsQ0FBQ0QsUUFBd0M7UUFDM0MsT0FBTyxJQUFJLENBQUMsQ0FBQUosR0FBSSxDQUFDTSxlQUFlLENBQUNGLFFBQVEsQ0FBQztNQUM1QztNQUVBRyxhQUFhQSxDQUFDQyxJQUFZLEVBQUVDLElBQVk7UUFDdEMsT0FBTyxJQUFJLENBQUMsQ0FBQVQsR0FBSSxDQUFDTyxhQUFhLENBQUNDLElBQUksRUFBRUMsSUFBSSxDQUFDO01BQzVDOztJQUNEQyxPQUFBLENBQUFYLE9BQUEsR0FBQUEsT0FBQSJ9