const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Patch MarketItem
const oldMarketItem = `function MarketItem({ title, desc, baseCost, count, icon: Icon, animClass, coins, onClick, max, isLocked, lockedReason }: any) {
  const isMaxed = max !== undefined && count >= max;
  const currentCost = Math.floor(baseCost * Math.pow(1.5, count));
  const canAfford = coins >= currentCost && !isMaxed && !isLocked;
  
  return (
    <button 
      onClick={isLocked || isMaxed ? undefined : onClick}
      disabled={!canAfford && !isMaxed && !isLocked}
      data-locked={isLocked ? 'true' : (!canAfford && !isMaxed ? 'true' : 'false')}
      className={\`w-full rounded-xl border p-3 flex items-center justify-between transition-all \${
        isLocked 
          ? 'border-slate-800 text-slate-600 bg-slate-900/30 cursor-not-allowed opacity-60'
          : isMaxed
          ? 'border-emerald-500/60 text-emerald-400 bg-emerald-900/20'
          : canAfford 
          ? 'border-emerald-500/40 text-emerald-400 bg-black/40 backdrop-blur-md hover:bg-emerald-900/40 cursor-pointer active:scale-95 hover:border-emerald-500/60' 
          : 'border-emerald-900/30 text-emerald-800 bg-black/20 hover:bg-black/40 active:scale-95'
      }\`}
    >
      <div className="flex items-center gap-3">
        <div className={\`p-2 rounded-lg bg-black/50 border \${isLocked ? 'border-slate-800' : 'border-emerald-900/30'} \${count > 0 && !isLocked ? animClass : 'opacity-50'}\`}>
           {isLocked ? <Lock className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        <div className="flex flex-col items-start text-left">
            <span className="font-bold text-sm sm:text-base flex items-center gap-2">
               {title}
            </span>
            <span className="text-[10px] sm:text-xs opacity-70">
               {isLocked ? lockedReason : desc}
            </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
          <span className={\`font-bold text-sm sm:text-base \${isLocked ? 'text-slate-600' : isMaxed ? 'text-emerald-400' : 'text-emerald-300'}\`}>
             {isLocked ? 'ZABLOKOWANE' : isMaxed ? 'MAX' : \`\${formatNum(currentCost)} B\`}
          </span>
          {!isLocked && <span className="text-[10px] sm:text-xs opacity-70">Posiadasz: {count}{max ? \`/\${max}\` : ''} szt.</span>}
      </div>
    </button>
  );
}`;

const newMarketItem = `function MarketItem({ title, desc, baseCost, count, icon: Icon, animClass, coins, onClick, max, isLocked, lockedReason, maxBuffDesc }: any) {
  const isMaxed = max !== undefined && count >= max;
  const currentCost = Math.floor(baseCost * Math.pow(1.5, count));
  const canAfford = coins >= currentCost && !isMaxed && !isLocked;
  
  const progressPercent = max ? Math.min(100, Math.floor((count / max) * 100)) : 0;
  
  return (
    <button 
      onClick={isLocked || isMaxed ? undefined : onClick}
      disabled={!canAfford && !isMaxed && !isLocked}
      data-locked={isLocked ? 'true' : (!canAfford && !isMaxed ? 'true' : 'false')}
      className={\`w-full rounded-xl border p-3 flex flex-col gap-2 transition-all relative overflow-hidden group \${
        isLocked 
          ? 'border-slate-800 text-slate-600 bg-slate-900/30 cursor-not-allowed opacity-60'
          : isMaxed
          ? 'border-fuchsia-500/60 text-fuchsia-400 bg-fuchsia-900/20 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
          : canAfford 
          ? 'border-emerald-500/40 text-emerald-400 bg-black/40 backdrop-blur-md hover:bg-emerald-900/40 cursor-pointer active:scale-95 hover:border-emerald-500/60' 
          : 'border-emerald-900/30 text-emerald-800 bg-black/20 hover:bg-black/40 active:scale-95'
      }\`}
    >
      {isMaxed && (
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 via-yellow-500/10 to-fuchsia-600/10 animate-pulse pointer-events-none" />
      )}
      <div className="flex items-center justify-between w-full relative z-10">
          <div className="flex items-center gap-3">
            <div className={\`p-2 rounded-lg bg-black/50 border \${isLocked ? 'border-slate-800' : isMaxed ? 'border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'border-emerald-900/30'} \${count > 0 && !isLocked ? (isMaxed ? 'text-yellow-400' : animClass) : 'opacity-50'}\`}>
               {isLocked ? <Lock className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div className="flex flex-col items-start text-left">
                <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                   {title}
                </span>
                <span className={\`text-[10px] sm:text-xs opacity-70 \${isMaxed ? 'text-fuchsia-300 font-bold' : ''}\`}>
                   {isLocked ? lockedReason : isMaxed && maxBuffDesc ? \`MAX: \${maxBuffDesc}\` : desc}
                </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
              <span className={\`font-bold text-sm sm:text-base \${isLocked ? 'text-slate-600' : isMaxed ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' : 'text-emerald-300'}\`}>
                 {isLocked ? 'ZABLOKOWANE' : isMaxed ? 'MASTER' : \`\${formatNum(currentCost)} B\`}
              </span>
              {!isLocked && <span className="text-[10px] sm:text-xs opacity-70">Posiadasz: {count}{max ? \`/\${max}\` : ''} szt.</span>}
          </div>
      </div>
      
      {max && !isLocked && (
          <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mt-1 relative z-10">
              <div 
                  className={\`h-full transition-all duration-500 \${isMaxed ? 'bg-gradient-to-r from-fuchsia-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-emerald-500/50'}\`}
                  style={{ width: \`\${progressPercent}%\` }}
              />
          </div>
      )}
    </button>
  );
}`;

if (code.includes('function MarketItem({ title, desc, baseCost, count, icon: Icon, animClass, coins, onClick, max, isLocked, lockedReason }: any) {')) {
    code = code.replace(oldMarketItem, newMarketItem);
}

// Update maxBuffDesc
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('clickVirus', 1000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('clickVirus', 1000)} \n                      maxBuffDesc="Wirus Podwójna Siła (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('autoClicker', 1500\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('autoClicker', 1500)} \n                      maxBuffDesc="AutoClicker Podwójna Siła (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('cryptoMiner', 20000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('cryptoMiner', 20000)} \n                      maxBuffDesc="Koparka Krypto (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('trollFarm', 150000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('trollFarm', 150000)} \n                      maxBuffDesc="Farma Trolli (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('aiBotnet', 1000000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('aiBotnet', 1000000)} \n                      maxBuffDesc="Botnet AI (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('quantumDecryptor', 5000000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('quantumDecryptor', 5000000)} \n                      maxBuffDesc="Dekryptor Kwantowy (x2)"\n                    />`
);
code = code.replace(
  /onClick=\{\(\) => buyUpgrade\('darkWebSyndicate', 25000000\)\} \n                    \/>/g,
  `onClick={() => buyUpgrade('darkWebSyndicate', 25000000)} \n                      maxBuffDesc="Syndykat Dark Web (x2)"\n                    />`
);

// Patch calculations
const oldCalcs = `const gridIncome = grid.reduce((sum, item) => sum + (item ? getLevelIncome(item.level) : 0), 0);
  const passiveIncomeMultiplier = 1 
    + (upgrades.cryptoMiner * 1) 
    + (upgrades.trollFarm * 4)
    + ((upgrades.aiBotnet || 0) * 10)
    + ((upgrades.quantumDecryptor || 0) * 25)
    + ((upgrades.darkWebSyndicate || 0) * 100)
    + ((upgrades.cyberDysonSphere || 0) * 500);
  const basePassiveIncome = gridIncome * passiveIncomeMultiplier;
  
  const baseClickPower = 1 + Math.floor(0.01 * basePassiveIncome) + (upgrades.clickVirus * 5);
  const autoClickerIncome = upgrades.autoClicker * Math.max(1, Math.floor(0.1 * baseClickPower));`;

const newCalcs = `const gridIncome = grid.reduce((sum, item) => sum + (item ? getLevelIncome(item.level) : 0), 0);
  
  const clickVirusMax = upgrades.clickVirus >= 50 ? 2 : 1;
  const autoClickerMax = upgrades.autoClicker >= 50 ? 2 : 1;
  const cryptoMinerMax = upgrades.cryptoMiner >= 50 ? 2 : 1;
  const trollFarmMax = upgrades.trollFarm >= 50 ? 2 : 1;
  const aiBotnetMax = (upgrades.aiBotnet || 0) >= 50 ? 2 : 1;
  const quantumDecryptorMax = (upgrades.quantumDecryptor || 0) >= 50 ? 2 : 1;
  const darkWebSyndicateMax = (upgrades.darkWebSyndicate || 0) >= 50 ? 2 : 1;
  
  const passiveIncomeMultiplier = 1 
    + (upgrades.cryptoMiner * 1 * cryptoMinerMax) 
    + (upgrades.trollFarm * 4 * trollFarmMax)
    + ((upgrades.aiBotnet || 0) * 10 * aiBotnetMax)
    + ((upgrades.quantumDecryptor || 0) * 25 * quantumDecryptorMax)
    + ((upgrades.darkWebSyndicate || 0) * 100 * darkWebSyndicateMax)
    + ((upgrades.cyberDysonSphere || 0) * 500);
  const basePassiveIncome = gridIncome * passiveIncomeMultiplier;
  
  const baseClickPower = 1 + Math.floor(0.01 * basePassiveIncome) + (upgrades.clickVirus * 5 * clickVirusMax);
  const autoClickerIncome = upgrades.autoClicker * Math.max(1, Math.floor(0.1 * baseClickPower)) * autoClickerMax;`;

if (code.includes('const gridIncome = grid.reduce((sum, item) => sum + (item ? getLevelIncome(item.level) : 0), 0);')) {
    code = code.replace(oldCalcs, newCalcs);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Patched mastery!');
