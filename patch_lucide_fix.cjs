const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "Orbit\n  Bitcoin",
  "Orbit,\n  Bitcoin"
);

fs.writeFileSync('src/App.tsx', code);
