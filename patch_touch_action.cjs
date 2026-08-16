const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "className={\`w-full max-w-lg mb-0.5 relative z-10 px-2 py-1.5 sm:py-2 rounded-xl border backdrop-blur-sm font-bold text-sm sm:text-base uppercase tracking-widest flex-shrink-0 flex items-center justify-center gap-2 select-none transition-[transform,background-color,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.8,-0.5,0.2,1.8)] active:scale-y-[0.85] active:scale-x-[1.05]",
  "className={\`touch-manipulation w-full max-w-lg mb-0.5 relative z-10 px-2 py-1.5 sm:py-2 rounded-xl border backdrop-blur-sm font-bold text-sm sm:text-base uppercase tracking-widest flex-shrink-0 flex items-center justify-center gap-2 select-none transition-[transform,background-color,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.8,-0.5,0.2,1.8)] active:scale-y-[0.85] active:scale-x-[1.05]"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched touch-action');
