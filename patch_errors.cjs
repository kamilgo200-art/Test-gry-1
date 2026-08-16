const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// fix bug
code = code.replace("Bitcoin,\n  Bug,", "Bitcoin,");

// fix shake
code = code.replace("triggerShake('medium', 200)", "triggerShake('heavy', 200)");

fs.writeFileSync('src/App.tsx', code);
