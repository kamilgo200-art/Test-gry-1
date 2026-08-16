const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Terminal log mb-1 -> mb-0.5
code = code.replace(
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10 gap-1 mb-1"',
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10 gap-0.5 mb-0.5"'
);

// Attack button mb-1 -> mb-0.5, py-3 sm:py-4 -> py-2 sm:py-3
code = code.replace(
  'mb-1 relative z-10 px-4 py-3 sm:py-4 rounded-xl border-2',
  'mb-0.5 relative z-10 px-4 py-2 sm:py-3 rounded-xl border-2'
);

// Footer pb-1 -> pb-0
code = code.replace(
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 pb-1 relative z-10"',
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10"'
);

// Kompiluj skrypt button padding and margin
code = code.replace(
  'className={`w-full rounded-xl relative z-10 px-4 py-1.5 sm:py-2 border font-bold text-sm sm:text-base transition-all uppercase tracking-wider shadow-lg',
  'className={`w-full rounded-lg relative z-10 px-2 py-1 sm:py-1.5 border font-bold text-sm transition-all uppercase tracking-wider shadow-lg'
);

// ROOT Panel mb-1 -> mb-0.5, p-2 -> p-1.5
code = code.replace(
  'className={`w-full max-w-lg mb-1 border rounded-xl p-2',
  'className={`w-full max-w-lg mb-0.5 border rounded-lg p-1.5'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Layout patched');
