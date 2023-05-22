globalThis.__app_package = {specifier: '@aimpact/backend'};
Object.defineProperty(globalThis, 'brequire', {get: () => require});
Object.defineProperty(globalThis, 'bimport', {get: () => async specifier => require(specifier)});

require('./start.js');