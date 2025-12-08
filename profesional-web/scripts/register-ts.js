/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Minimal TypeScript require hook using the local TypeScript compiler.
 * Supports the "@/..." alias by resolving it to the project root.
 * 
 * Note: Uses deprecated require.extensions API as it's the simplest solution
 * for on-the-fly TS compilation in Node.js scripts without bundler overhead.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('module');
const ts = require('typescript');

const projectRoot = process.cwd();
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const resolved = path.join(projectRoot, request.slice(2));
    return originalResolve.call(this, resolved, parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

require.extensions['.ts'] = function compileTs(module, filename) {
  const source = fs.readFileSync(filename, 'utf-8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      allowJs: true,
      jsx: ts.JsxEmit.ReactJSX,
      strict: false,
      resolveJsonModule: true,
    },
    fileName: filename,
  });

  module._compile(outputText, filename);
};
