const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = '`}</style>';
const renderCode = `\`}</style>
      
      {flyingVirus && (
          <button
              key={flyingVirus.id}
              onPointerDown={handleVirusClick}
              className={\`fixed z-[100] p-3 sm:p-4 rounded-full animate-fly-across backdrop-blur-md border touch-none cursor-pointer \${
                  flyingVirus.type === 'btc' 
                  ? 'text-orange-400 border-orange-500 bg-orange-900/60 shadow-[0_0_30px_rgba(249,115,22,0.8)]' 
                  : 'text-red-400 border-red-500 bg-red-900/60 shadow-[0_0_30px_rgba(239,68,68,0.8)]'
              }\`}
              style={{
                  top: \`\${flyingVirus.top}%\`,
                  animationDuration: \`\${flyingVirus.duration}s\`,
              }}
          >
              {flyingVirus.type === 'btc' ? <Bitcoin className="w-8 h-8 sm:w-12 sm:h-12 animate-spin-slow" /> : <Bug className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce" />}
          </button>
      )}`;

code = code.replace(target, renderCode);
fs.writeFileSync('src/App.tsx', code);
console.log('patched render virus');
