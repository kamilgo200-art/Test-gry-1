const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Manualny atak (py-2 sm:py-3 -> py-3 sm:py-4, text-base -> text-lg)
code = code.replace(
  'touch-manipulation w-full max-w-lg mb-0.5 relative z-10 px-4 py-2 sm:py-3 rounded-xl border-2 backdrop-blur-sm font-black text-base sm:text-xl uppercase tracking-[0.15em] flex-shrink-0 flex items-center justify-center gap-2',
  'touch-manipulation w-full max-w-lg mb-0.5 relative z-10 px-4 py-3 sm:py-4 rounded-xl border-2 backdrop-blur-sm font-black text-lg sm:text-xl uppercase tracking-[0.15em] flex-shrink-0 flex items-center justify-center gap-2'
);

// 2. Kompiluj skrypt (Footer / Buy Script wrapper: add mt-auto to push it down)
code = code.replace(
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10"',
  'className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10 mt-auto"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Tweaks applied');
