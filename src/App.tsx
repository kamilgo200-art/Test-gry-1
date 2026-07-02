import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Cpu,
  Network,
  Server,
  Database,
  ShieldAlert,
  Bug,
  Bot,
  Flame,
  Zap,
  Gift
} from 'lucide-react';

type Item = {
  id: string;
  level: number;
};

type GridSlot = Item | null;

const LEVEL_CONFIG: Record<number, { name: string, icon: React.ElementType, color: string }> = {
  1: { name: '.bat', icon: Terminal, color: 'text-emerald-400' },
  2: { name: 'BlueScreen', icon: Cpu, color: 'text-blue-400' },
  3: { name: 'Wyłącz Komp', icon: Network, color: 'text-indigo-400' },
  4: { name: 'Trojan', icon: Server, color: 'text-purple-400' },
  5: { name: 'DDoS', icon: Database, color: 'text-pink-400' },
  6: { name: 'Rootkit', icon: ShieldAlert, color: 'text-red-400' },
  7: { name: 'Botnet', icon: Bug, color: 'text-orange-400' },
  8: { name: 'Zero-Day', icon: Bot, color: 'text-yellow-400' },
  9: { name: 'AI.sys', icon: Flame, color: 'text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]' },
};

const LEVEL_INCOME: Record<number, number> = {
  1: 1,
  2: 5,
  3: 25,
  4: 100,
  5: 500,
  6: 2500,
  7: 12500,
  8: 62500,
  9: 312500,
};

const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
};

const LOGS = [
  "Omijanie zapory...",
  "Łamanie hasha MD5...",
  "Skanowanie portów...",
  "Wgrywanie payloadu...",
  "Nawiązywanie połączenia z proxy..."
];

export default function App() {
  const [coins, setCoins] = useState(100);
  const [scriptCost, setScriptCost] = useState(25);
  const [grid, setGrid] = useState<GridSlot[]>(Array(16).fill(null));
  
  const [mergedIndex, setMergedIndex] = useState<number | null>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [dropTimer, setDropTimer] = useState(60);
  const [logText, setLogText] = useState(LOGS[0]);
  
  const [upgrades, setUpgrades] = useState({
    autoClicker: false,
    cryptoMiner: false,
    trollFarm: false,
  });

  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);
  const toastIdCounter = useRef(0);

  const addToast = (msg: string) => {
    const id = toastIdCounter.current++;
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const gridIncome = grid.reduce((sum, item) => sum + (item ? LEVEL_INCOME[item.level] || 0 : 0), 0);
  const passiveIncomeMultiplier = (upgrades.cryptoMiner ? 2 : 1) * (upgrades.trollFarm ? 5 : 1);
  
  const baseClickPower = 1 + Math.floor(0.02 * gridIncome * passiveIncomeMultiplier);
  const autoClickerIncome = upgrades.autoClicker ? Math.floor(0.1 * baseClickPower) : 0;
  
  const baseTotalIncome = (gridIncome * passiveIncomeMultiplier) + autoClickerIncome;
  
  const isBoostActive = boostTimeLeft > 0;
  const boostMultiplier = isBoostActive ? 3 : 1;
  
  const finalTotalIncome = baseTotalIncome * boostMultiplier;
  const finalClickPower = baseClickPower * boostMultiplier;

  const handleManualAttack = () => {
    setCoins(prev => prev + finalClickPower);
  };

  const buyUpgrade = (key: keyof typeof upgrades, cost: number) => {
    if (coins >= cost && !upgrades[key]) {
      setCoins(prev => prev - cost);
      setUpgrades(prev => ({ ...prev, [key]: true }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + finalTotalIncome);
      setBoostTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      setDropTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [finalTotalIncome]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogText(LOGS[Math.floor(Math.random() * LOGS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
    if (coins >= scriptCost) {
      const emptyIndex = grid.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        setCoins(prev => prev - scriptCost);
        setScriptCost(prev => Math.ceil(prev * 1.30));
        
        const newGrid = [...grid];
        newGrid[emptyIndex] = { id: Math.random().toString(36).slice(2, 9), level: 1 };
        setGrid(newGrid);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const sourceItem = newGrid[sourceIndex];
      const targetItem = newGrid[targetIndex];

      if (!sourceItem) return prevGrid;

      if (targetItem && targetItem.level === sourceItem.level) {
        const nextLevel = sourceItem.level + 1;
        newGrid[targetIndex] = { id: targetItem.id, level: nextLevel };
        newGrid[sourceIndex] = null;
        
        setMergedIndex(targetIndex);
        setTimeout(() => setMergedIndex(null), 300);
        addToast("Połączono!");
      } else {
        newGrid[targetIndex] = sourceItem;
        newGrid[sourceIndex] = targetItem;
      }
      return newGrid;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClaimDrop = () => {
    const reward = Math.max(500, 100 * finalTotalIncome);
    setCoins(prev => prev + reward);
    setDropTimer(60);
    addToast(`Otrzymano Zrzut: +${formatNum(reward)}!`);
  };

  const hasEmptySlot = grid.some(slot => slot === null);
  const canBuy = coins >= scriptCost && hasEmptySlot;

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-black text-emerald-500 font-mono flex flex-col items-center p-1 sm:p-2 relative selection:bg-emerald-500 selection:text-black">
      <style>{'.hide-scrollbar::-webkit-scrollbar { display: none; }'}</style>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-40"></div>
      
      {/* Toasts */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-black/60 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-bounce">
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header Panel */}
      <div className="w-full max-w-lg mb-1 border border-emerald-500/30 rounded-2xl p-2 bg-black/40 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h1 className="text-sm sm:text-lg font-bold tracking-widest uppercase shadow-emerald-500/50 drop-shadow-md">
            TERMINAL_OS v1.4
          </h1>
          <button 
            onClick={() => { if (!isBoostActive) setBoostTimeLeft(30) }}
            disabled={isBoostActive}
            className={`px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-bold uppercase transition-colors ${
              isBoostActive 
                ? 'border-yellow-900/50 text-yellow-700/50 bg-yellow-900/10 cursor-not-allowed' 
                : 'border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 cursor-pointer shadow-[0_0_8px_rgba(234,179,8,0.3)] animate-pulse'
            }`}
          >
            {isBoostActive ? `[ ⏳ ${boostTimeLeft}s ]` : '[ 💰 BOOST x3 ]'}
          </button>
        </div>
        <div className="flex flex-row justify-between items-center text-xs sm:text-sm gap-2">
          <div className="font-bold">
            Bity: <span className="text-emerald-300">{formatNum(Math.floor(coins))}</span>
          </div>
          <div>
            Kopanie: <span className="text-emerald-300">{formatNum(finalTotalIncome)}</span>/s
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full max-w-lg relative z-10 mb-1">
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1.5 sm:p-2 border border-emerald-500/20 rounded-2xl bg-black/40 backdrop-blur-md aspect-square w-full max-w-[320px] sm:max-w-[380px] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {grid.map((slot, index) => {
            const isMerged = mergedIndex === index;
            const config = slot ? LEVEL_CONFIG[slot.level] || LEVEL_CONFIG[9] : null;
            const Icon = config ? config.icon : null;
            return (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="w-full h-full border border-emerald-900/40 rounded-xl bg-slate-900/30 flex items-center justify-center relative transition-colors aspect-square"
              >
                {slot && config && Icon && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    className={`absolute inset-0 sm:inset-0.5 border border-emerald-500/30 rounded-xl bg-slate-900/80 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-emerald-900/30 hover:border-emerald-500/50 shadow-inner ${
                      isMerged 
                        ? 'scale-[1.25] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200' 
                        : 'transition-all duration-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${config.color}`} />
                    <div className={`text-[8px] sm:text-[9px] font-bold text-center leading-tight px-0.5 break-words w-full ${config.color}`}>
                      {config.name}
                    </div>
                    <div className="absolute top-0.5 left-1 text-[7px] opacity-50">v{slot.level}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop / Terminal Log */}
      <div className="w-full max-w-lg flex flex-col items-center flex-shrink-0 relative z-10 gap-1 mb-1">
        {dropTimer === 0 && (
          <button 
            onClick={handleClaimDrop}
            className="w-full px-2 py-1.5 sm:py-2 rounded-xl border border-purple-500/60 bg-purple-900/30 font-bold text-xs sm:text-sm uppercase tracking-widest text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-800/40 active:scale-95 cursor-pointer animate-pulse flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" /> [ ODBIERZ ZRZUT DANYCH ]
          </button>
        )}
        
        <div className="w-full text-[9px] sm:text-[10px] text-emerald-500/60 flex items-center gap-2 px-2 overflow-hidden bg-black/20 rounded-lg py-0.5 border border-emerald-900/30">
          <span className="animate-pulse">{'>_'}</span>
          <span className="truncate">{logText}</span>
        </div>
      </div>

      {/* Upgrades Shop */}
      <div 
        className="flex overflow-x-auto gap-2 py-1 px-1 shrink-0 w-full max-w-lg mb-1 hide-scrollbar relative z-10" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <UpgradeBtn 
          title="Auto-Clicker" 
          desc="10% klik/s" 
          cost={1500} 
          bought={upgrades.autoClicker} 
          canAfford={coins >= 1500} 
          onClick={() => buyUpgrade('autoClicker', 1500)} 
        />
        <UpgradeBtn 
          title="Koparka Krypto" 
          desc="Zarobek x2" 
          cost={20000} 
          bought={upgrades.cryptoMiner} 
          canAfford={coins >= 20000} 
          onClick={() => buyUpgrade('cryptoMiner', 20000)} 
        />
        <UpgradeBtn 
          title="Farma Trolli" 
          desc="Zarobek x5" 
          cost={150000} 
          bought={upgrades.trollFarm} 
          canAfford={coins >= 150000} 
          onClick={() => buyUpgrade('trollFarm', 150000)} 
        />
      </div>

      {/* Attack Button */}
      <button
        onClick={handleManualAttack}
        className="w-full max-w-lg mb-1 relative z-10 px-2 py-2 sm:py-3 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 backdrop-blur-sm font-bold text-sm sm:text-base uppercase tracking-widest text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-900/60 active:scale-95 active:bg-emerald-600 active:text-black cursor-pointer select-none transition-all duration-100 flex-shrink-0 flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5" /> [ MANUALNY ATAK ] (+{formatNum(finalClickPower)})
      </button>

      {/* Footer / Buy Script */}
      <div className="w-full max-w-lg flex flex-col items-center flex-shrink-0 pb-1 relative z-10">
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`w-full rounded-2xl relative z-10 px-4 py-2 sm:py-2.5 border font-bold text-sm sm:text-base transition-all uppercase tracking-wider shadow-lg ${
            canBuy 
              ? 'border-emerald-500/80 text-emerald-950 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer' 
              : 'border-emerald-900/50 text-emerald-800 bg-emerald-950/20 cursor-not-allowed'
          }`}
        >
          Kompiluj Skrypt ({formatNum(scriptCost)})
        </button>
        
        <div className="h-4 mt-0.5 flex items-center justify-center">
          {!hasEmptySlot && (
            <div className="text-red-400 animate-pulse font-bold uppercase relative z-10 text-[10px] sm:text-xs tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
              [ BŁĄD: Brak miejsca ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpgradeBtn({ title, desc, cost, bought, canAfford, onClick }: { title: string, desc: string, cost: number, bought: boolean, canAfford: boolean, onClick: () => void }) {
  if (bought) {
    return (
      <button disabled className="flex-none w-[110px] sm:w-[120px] rounded-xl border border-emerald-900/50 text-emerald-800 p-1.5 flex flex-col items-center justify-center text-center cursor-not-allowed bg-black/40 backdrop-blur-md">
        <span className="text-[10px] sm:text-xs font-bold leading-tight">{title}</span>
        <span className="text-[9px] sm:text-[10px] mt-1 opacity-70">[ KUPIONE ]</span>
      </button>
    );
  }
  
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className={`flex-none w-[110px] sm:w-[120px] rounded-xl border p-1.5 flex flex-col items-center justify-center text-center transition-all ${
        canAfford 
          ? 'border-emerald-500/40 text-emerald-400 bg-black/40 backdrop-blur-md hover:bg-emerald-900/40 cursor-pointer active:scale-95 hover:border-emerald-500/60' 
          : 'border-emerald-900/30 text-emerald-800 bg-black/20 cursor-not-allowed'
      }`}
    >
      <span className="text-[10px] sm:text-xs font-bold leading-tight">{title}</span>
      <span className="text-[8px] sm:text-[9px] leading-tight text-emerald-600/80 my-0.5">{desc}</span>
      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300">{formatNum(cost)} B</span>
    </button>
  );
}
