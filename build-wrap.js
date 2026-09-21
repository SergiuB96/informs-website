// Wraps each compiled .js file in an IIFE to prevent const re-declaration
// collisions when multiple scripts share the same global browser scope.
const fs = require('fs');
const files = ['Config', 'Layout', 'Icons', 'Pages', 'Legal', 'Shop', 'App'];
files.forEach(f => {
  const path = `${f}.js`;
  const src = fs.readFileSync(path, 'utf8');
  fs.writeFileSync(path, `(function(){\n${src}\n})();`, 'utf8');
  console.log(`Wrapped: ${path}`);
});
