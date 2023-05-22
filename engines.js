"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whisper = exports.hmr = exports.gptTurboPlus = exports.gptTurbo = exports.gpt4 = exports.davinci3 = exports.davinci2 = exports.currie1 = exports.babbage = exports.ada = exports.__beyond_pkg = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/engines"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([]);
const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 4114716790,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.whisper = exports.gptTurboPlus = exports.gptTurbo = exports.gpt4 = exports.davinci3 = exports.davinci2 = exports.currie1 = exports.babbage = exports.ada = void 0;
    /*bundle*/
    const whisper = "whisper-1";
    exports.whisper = whisper;
    /*bundle*/
    const gpt4 = "gpt-4-0314";
    exports.gpt4 = gpt4;
    /*bundle*/
    const gptTurbo = "gpt-3.5-turbo";
    exports.gptTurbo = gptTurbo;
    /*bundle*/
    const gptTurboPlus = "gpt-3.5-turbo-0301";
    exports.gptTurboPlus = gptTurboPlus;
    /*bundle*/
    const ada = "text-ada-001";
    exports.ada = ada;
    /*bundle*/
    const currie1 = "text-curie-001";
    exports.currie1 = currie1;
    /*bundle*/
    const babbage = "text-babbage-001";
    exports.babbage = babbage;
    /*bundle*/
    const davinci2 = "text-davinci-002";
    exports.davinci2 = davinci2;
    /*bundle*/
    const davinci3 = "text-davinci-003";
    exports.davinci3 = davinci3;
  }
});
__pkg.exports.descriptor = [{
  "im": "./index",
  "from": "whisper",
  "name": "whisper"
}, {
  "im": "./index",
  "from": "gpt4",
  "name": "gpt4"
}, {
  "im": "./index",
  "from": "gptTurbo",
  "name": "gptTurbo"
}, {
  "im": "./index",
  "from": "gptTurboPlus",
  "name": "gptTurboPlus"
}, {
  "im": "./index",
  "from": "ada",
  "name": "ada"
}, {
  "im": "./index",
  "from": "currie1",
  "name": "currie1"
}, {
  "im": "./index",
  "from": "babbage",
  "name": "babbage"
}, {
  "im": "./index",
  "from": "davinci2",
  "name": "davinci2"
}, {
  "im": "./index",
  "from": "davinci3",
  "name": "davinci3"
}];
let whisper, gpt4, gptTurbo, gptTurboPlus, ada, currie1, babbage, davinci2, davinci3;

// Module exports
exports.davinci3 = davinci3;
exports.davinci2 = davinci2;
exports.babbage = babbage;
exports.currie1 = currie1;
exports.ada = ada;
exports.gptTurboPlus = gptTurboPlus;
exports.gptTurbo = gptTurbo;
exports.gpt4 = gpt4;
exports.whisper = whisper;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'whisper') && (exports.whisper = whisper = require ? require('./index').whisper : value);
  (require || prop === 'gpt4') && (exports.gpt4 = gpt4 = require ? require('./index').gpt4 : value);
  (require || prop === 'gptTurbo') && (exports.gptTurbo = gptTurbo = require ? require('./index').gptTurbo : value);
  (require || prop === 'gptTurboPlus') && (exports.gptTurboPlus = gptTurboPlus = require ? require('./index').gptTurboPlus : value);
  (require || prop === 'ada') && (exports.ada = ada = require ? require('./index').ada : value);
  (require || prop === 'currie1') && (exports.currie1 = currie1 = require ? require('./index').currie1 : value);
  (require || prop === 'babbage') && (exports.babbage = babbage = require ? require('./index').babbage : value);
  (require || prop === 'davinci2') && (exports.davinci2 = davinci2 = require ? require('./index').davinci2 : value);
  (require || prop === 'davinci3') && (exports.davinci3 = davinci3 = require ? require('./index').davinci3 : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU87SUFBVyxNQUFNQSxPQUFPLEdBQUcsV0FBVztJQUFDQztJQUV2QztJQUFXLE1BQU1DLElBQUksR0FBRyxZQUFZO0lBQUNEO0lBRXJDO0lBQVcsTUFBTUUsUUFBUSxHQUFHLGVBQWU7SUFBQ0Y7SUFDNUM7SUFBVyxNQUFNRyxZQUFZLEdBQUcsb0JBQW9CO0lBQUNIO0lBRXJEO0lBQVcsTUFBTUksR0FBRyxHQUFHLGNBQWM7SUFBQ0o7SUFDdEM7SUFBVyxNQUFNSyxPQUFPLEdBQUcsZ0JBQWdCO0lBQUNMO0lBQzVDO0lBQVcsTUFBTU0sT0FBTyxHQUFHLGtCQUFrQjtJQUFDTjtJQUM5QztJQUFXLE1BQU1PLFFBQVEsR0FBRyxrQkFBa0I7SUFBQ1A7SUFDL0M7SUFBVyxNQUFNUSxRQUFRLEdBQUcsa0JBQWtCO0lBQUNSIiwibmFtZXMiOlsid2hpc3BlciIsImV4cG9ydHMiLCJncHQ0IiwiZ3B0VHVyYm8iLCJncHRUdXJib1BsdXMiLCJhZGEiLCJjdXJyaWUxIiwiYmFiYmFnZSIsImRhdmluY2kyIiwiZGF2aW5jaTMiXSwic291cmNlUm9vdCI6IkU6XFx3b3Jrc3BhY2VcXGFpbXBhY3QvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGxdfQ==