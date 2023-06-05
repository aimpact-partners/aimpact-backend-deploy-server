globalThis.__app_package = {specifier: '@aimpact/http-server'};
Object.defineProperty(globalThis, 'brequire', {get: () => require});
Object.defineProperty(globalThis, 'bimport', {get: () => async specifier => require(specifier)});

require('./start.js');