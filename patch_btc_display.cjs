const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div className="flex flex-row justify-between items-center text-xs sm:text-sm gap-2 bg-black/40 px-2 py-1 rounded-lg border border-emerald-900/40">
          <div className="font-bold">
            Bity: <span className="text-emerald-300">{formatNum(Math.floor(coins))}</span>
          </div>
          <div>
            Kopanie: <span className="text-emerald-300">{formatNum(finalTotalIncome)}</span>/s
          </div>
        </div>`;

const replacement = `<div className="flex flex-row justify-between items-center text-xs sm:text-sm gap-2 bg-black/40 px-2 py-1 rounded-lg border border-emerald-900/40">
          <div className="flex gap-3">
             <div className="font-bold">
               Bity: <span className="text-emerald-300">{formatNum(Math.floor(coins))}</span>
             </div>
             {bitcoins > 0 && (
                <div className="font-bold flex items-center gap-1 group relative cursor-help">
                   <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
                   <span className="text-orange-400">{formatNum(Math.floor(bitcoins))}</span>
                   <div className="absolute top-full left-0 mt-1 w-48 p-2 bg-black/90 border border-orange-500/50 rounded-lg text-[10px] text-orange-300 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                       <span className="font-bold block mb-1">DarkCoins (Premium)</span>
                       Każdy coin zwiększa pasywne kopanie oraz kliknięcie o stałe +5%.
                       Obecny bonus: +{(bitcoins * 5).toFixed(0)}%
                   </div>
                </div>
             )}
          </div>
          <div>
            Kopanie: <span className="text-emerald-300">{formatNum(finalTotalIncome)}</span>/s
          </div>
        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('patched btc display');
