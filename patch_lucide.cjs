const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "} from 'lucide-react';",
  "  Bitcoin,\n  Bug,\n} from 'lucide-react';"
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched imports');
