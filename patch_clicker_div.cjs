const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "</button>\n      {/* Overclock Shortcut */}";
const targetR = "</button>\r\n      {/* Overclock Shortcut */}";
const replacement = "</button>\n      </div>\n      {/* Overclock Shortcut */}";

if (code.includes(target)) {
    code = code.replace(target, replacement);
} else if (code.includes(targetR)) {
    code = code.replace(targetR, replacement);
} else {
    // regex fallback
    code = code.replace(/<\/button>\s*\{\/\* Overclock Shortcut \*\/\}/g, "</button>\\n      </div>\\n      {/* Overclock Shortcut */}");
}

fs.writeFileSync('src/App.tsx', code);
console.log('patched clicker div');
