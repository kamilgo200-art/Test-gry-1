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
  Gift,
  Play
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
  const [coins, setCoins] = useState(0);
  const [scriptCost, setScriptCost] = useState(40);
  const [grid, setGrid] = useState<GridSlot[]>(Array(16).fill(null));
  
  const [mergedIndex, setMergedIndex] = useState<number | null>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [dropTimer, setDropTimer] = useState(60);
  const [logText, setLogText] = useState(LOGS[0]);
  
  const [upgrades, setUpgrades] = useState({
    autoClicker: 0,
    cryptoMiner: 0,
    trollFarm: 0,
  });

  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);
  const toastIdCounter = useRef(0);

  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'normal' | 'epic', reward: number, isWatching: boolean} | null>(null);

  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);
  const floatingIdCounter = useRef(0);

  const addToast = (msg: string) => {
    const id = toastIdCounter.current++;
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const gridIncome = grid.reduce((sum, item) => sum + (item ? LEVEL_INCOME[item.level] || 0 : 0), 0);
  const passiveIncomeMultiplier = 1 + (upgrades.cryptoMiner * 1) + (upgrades.trollFarm * 4);
  const basePassiveIncome = gridIncome * passiveIncomeMultiplier;
  
  const baseClickPower = 1 + Math.floor(0.01 * basePassiveIncome);
  const autoClickerIncome = upgrades.autoClicker * Math.max(1, Math.floor(0.1 * baseClickPower));
  
  const baseTotalIncome = basePassiveIncome + autoClickerIncome;
  
  const isBoostActive = boostTimeLeft > 0;
  const boostMultiplier = isBoostActive ? 3 : 1;
  
  const finalTotalIncome = baseTotalIncome * boostMultiplier;
  const finalClickPower = baseClickPower * boostMultiplier;

  const handleManualAttack = (e: React.MouseEvent) => {
    setCoins(prev => prev + finalClickPower);
    
    const id = floatingIdCounter.current++;
    const x = e.clientX + (Math.random() * 40 - 20);
    const y = e.clientY + (Math.random() * 20 - 20) - 20;
    
    setFloatingTexts(prev => [...prev, { id, text: `+${formatNum(finalClickPower)}`, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  const buyUpgrade = (key: keyof typeof upgrades, baseCost: number) => {
    const currentCost = Math.floor(baseCost * Math.pow(1.5, upgrades[key]));
    if (coins >= currentCost) {
      setCoins(prev => prev - currentCost);
      setUpgrades(prev => ({ ...prev, [key]: prev[key] + 1 }));
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

  const handleClaimDropClick = () => {
    const isEpic = Math.random() < 0.4;
    const reward = Math.max(50, 100 * finalTotalIncome);
    setModalState({
      isOpen: true,
      type: isEpic ? 'epic' : 'normal',
      reward,
      isWatching: false
    });
  };

  const handleClaimModal = (multiplier: number) => {
    if (modalState) {
      if (multiplier > 1) {
        setModalState({ ...modalState, isWatching: true });
        addToast("Ładowanie połączenia z proxy...");
        setTimeout(() => {
          setCoins(prev => prev + modalState.reward * multiplier);
          setDropTimer(60);
          setModalState(null);
          addToast(`Epicki Zrzut: +${formatNum(modalState.reward * multiplier)}!`);
        }, 2000);
      } else {
        setCoins(prev => prev + modalState.reward);
        setDropTimer(60);
        setModalState(null);
        addToast(`Zrzut Danych: +${formatNum(modalState.reward)}!`);
      }
    }
  };

  const hasEmptySlot = grid.some(slot => slot === null);
  const canBuy = coins >= scriptCost && hasEmptySlot;

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-black text-emerald-500 font-mono flex flex-col items-center p-1 sm:p-2 relative selection:bg-emerald-500 selection:text-black">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes floatUp {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -60px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 1s ease-out forwards;
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-40"></div>
      
      {/* Floating Texts */}
      {floatingTexts.map(f => (
        <div 
          key={f.id} 
          className="fixed pointer-events-none z-50 text-emerald-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-float-up" 
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}

      {/* Toasts */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-black/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-bounce">
            {t.msg}
          </div>
        ))}
      </div>

      {/* Ad Roulette Modal */}
      {modalState && modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl border p-4 sm:p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden ${
            modalState.type === 'epic' 
              ? 'border-yellow-500/50 bg-slate-900/95 shadow-[0_0_30px_rgba(234,179,8,0.2)]' 
              : 'border-emerald-500/50 bg-slate-900/95 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          }`}>
            {modalState.isWatching ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Network className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                <div className="text-yellow-400 font-bold uppercase tracking-widest animate-pulse">
                  Nawiązywanie...
                </div>
              </div>
            ) : modalState.type === 'epic' ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
                  Złamałeś serwer!
                </h2>
                <p className="text-emerald-300/80 text-xs sm:text-sm mb-6">Znaleziono ukryte archiwum danych korporacyjnych.</p>
                <div className="flex flex-col gap-3 w-full relative z-10">
                  <button 
                    onClick={() => handleClaimModal(5)}
                    className="w-full py-3 rounded-xl border border-yellow-500 bg-yellow-900/40 text-yellow-400 font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:bg-yellow-800/60 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Play className="w-5 h-5" /> ODBIERZ x5 (Wideo)
                  </button>
                  <button 
                    onClick={() => handleClaimModal(1)}
                    className="text-[10px] sm:text-xs text-emerald-500/50 hover:text-emerald-400 transition-colors uppercase tracking-wider py-2"
                  >
                    Nie, weź zwykłą nagrodę ({formatNum(modalState.reward)})
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-emerald-400 mb-2 uppercase tracking-widest">
                  Zwykły zrzut danych
                </h2>
                <p className="text-emerald-500/60 text-xs sm:text-sm mb-6">Paczka danych przechwycona pomyślnie.</p>
                <button 
                  onClick={() => handleClaimModal(1)}
                  className="w-full py-3 rounded-xl border border-emerald-500/50 bg-emerald-900/30 text-emerald-400 font-bold uppercase tracking-wider hover:bg-emerald-800/40 active:scale-95 transition-all"
                >
                  Odbierz {formatNum(modalState.reward)} Bitów
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="w-full max-w-lg mb-1 border border-emerald-500/30 rounded-2xl p-2 bg-black/40 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h1 className="text-sm sm:text-lg font-bold tracking-widest uppercase shadow-emerald-500/50 drop-shadow-md">
            TERMINAL_OS v1.5
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
            onClick={handleClaimDropClick}
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
          baseCost={1500}
          count={upgrades.autoClicker} 
          coins={coins}
          icon={Bot}
          animClass="animate-bounce text-blue-400"
          onClick={() => buyUpgrade('autoClicker', 1500)} 
        />
        <UpgradeBtn 
          title="Koparka Krypto" 
          desc="Zarobek x2" 
          baseCost={20000} 
          count={upgrades.cryptoMiner} 
          coins={coins}
          icon={Cpu}
          animClass="animate-[spin_3s_linear_infinite] text-purple-400"
          onClick={() => buyUpgrade('cryptoMiner', 20000)} 
        />
        <UpgradeBtn 
          title="Farma Trolli" 
          desc="Zarobek x5" 
          baseCost={150000} 
          count={upgrades.trollFarm} 
          coins={coins}
          icon={Bug}
          animClass="animate-pulse text-red-400"
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

function UpgradeBtn({ title, desc, baseCost, count, icon: Icon, animClass, coins, onClick }: any) {
  const currentCost = Math.floor(baseCost * Math.pow(1.5, count));
  const canAfford = coins >= currentCost;
  
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
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${count > 0 ? animClass : 'opacity-50'}`} />
        <span className="text-[10px] sm:text-xs font-bold leading-tight">{title}</span>
      </div>
      <span className="text-[8px] sm:text-[9px] leading-tight text-emerald-600/80 my-0.5">{desc}</span>
      <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300">{formatNum(currentCost)} B</span>
      <span className="text-[8px] sm:text-[9px] mt-0.5 opacity-70">Posiadasz: {count} szt.</span>
    </button>
  );
}
