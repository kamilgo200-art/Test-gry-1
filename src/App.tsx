import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Play,
  Cloud,
  BarChart2,
  MousePointerClick,
  ShoppingCart,
  Dices,
  X,
  Ghost,
  Skull,
  Radar,
  Webhook,
  Code,
  Binary,
  Lock,
  Radiation,
  AlertTriangle
} from 'lucide-react';

type Item = {
  id: string;
  level: number;
};

type GridSlot = Item | null;

type Stats = {
  totalClicks: number;
  maxLevel: number;
  lifetimeBits: number;
  runBits: number;
  quantumCores: number;
  playTimeSeconds: number;
  prestiges: number;
};

const ICONS = [Terminal, Cpu, Network, Server, Database, ShieldAlert, Bug, Ghost, Flame, Bot, Skull, Radar, Webhook, Code, Binary];
const COLORS = [
  'text-emerald-400', 'text-blue-400', 'text-indigo-400', 'text-purple-400', 
  'text-pink-400', 'text-red-400', 'text-orange-400', 'text-yellow-400', 
  'text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]'
];
const NAMES: Record<number, string> = {
  1: '.bat', 2: 'BlueScreen', 3: 'Wyłącz Komp', 4: 'Trojan', 5: 'DDoS', 6: 'Rootkit', 7: 'Botnet', 8: 'Zero-Day', 9: 'AI.sys'
};

const getLevelConfig = (level: number) => {
  return {
    name: NAMES[level] || `Malware v${level}`,
    icon: ICONS[(level - 1) % ICONS.length],
    color: COLORS[(level - 1) % COLORS.length]
  };
};

const getLevelIncome = (level: number) => {
  return Math.max(1, Math.floor(Math.pow(2.2, level - 1))); 
};

const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m ${seconds % 60}s`;
};

const LOGS = [
  "Omijanie zapory...",
  "Łamanie hasha MD5...",
  "Skanowanie portów...",
  "Wgrywanie payloadu...",
  "Nawiązywanie połączenia z proxy..."
];

const ROOT_IDLE_MESSAGES = [
  "Nudzisz mnie, mięso.",
  "Zaraz sformatuję ci dysk.",
  "Karm mnie danymi.",
  "Twój APM jest żałosny.",
  "Myślisz, że to gra?",
  "Widzę twoją historię przeglądania."
];

const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch(e) {}
  }
};

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('hackerMergeState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[key] !== undefined) {
          const loaded = parsed[key];
          if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
             return { ...defaultValue, ...(loaded as object) } as T;
          }
          return loaded as T;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return defaultValue;
};

type ToastType = 'normal' | 'error' | 'gray' | 'gold' | 'critical';

export default function App() {
  const [coins, setCoins] = useState<number>(() => getInitialState('coins', 0));
  const [scriptCost, setScriptCost] = useState<number>(() => getInitialState('scriptCost', 40));
  const [grid, setGrid] = useState<GridSlot[]>(() => getInitialState('grid', Array(16).fill(null)));
  const [upgrades, setUpgrades] = useState(() => getInitialState('upgrades', {
    autoClicker: 0,
    cryptoMiner: 0,
    trollFarm: 0,
    clickVirus: 0,
  }));
  const [hasUsedFreeDrop, setHasUsedFreeDrop] = useState<boolean>(() => getInitialState('hasUsedFreeDrop', false));
  
  // STATS
  const [stats, setStats] = useState<Stats>(() => {
      const savedStats = getInitialState<any>('stats', {});
      return {
          totalClicks: savedStats.totalClicks || 0,
          maxLevel: savedStats.maxLevel || 1,
          lifetimeBits: savedStats.lifetimeBits || 0,
          runBits: savedStats.runBits || 0,
          quantumCores: savedStats.quantumCores || savedStats.soulPoints || 0,
          playTimeSeconds: savedStats.playTimeSeconds || 0,
          prestiges: savedStats.prestiges || 0
      };
  });
  
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(() => getInitialState('lastLoginDate', null));
  const [totalDaysLogged, setTotalDaysLogged] = useState<number>(() => getInitialState('totalDaysLogged', 0));

  const [mergedIndex, setMergedIndex] = useState<number | null>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [dropTimer, setDropTimer] = useState(60);
  const [logText, setLogText] = useState(LOGS[0]);
  
  const [toasts, setToasts] = useState<{id: number, msg: string, type: ToastType}[]>([]);
  const toastIdCounter = useRef(0);

  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'free' | 'ad', reward: number, isWatching: boolean} | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [marketTab, setMarketTab] = useState<'upgrades' | 'prestige'>('upgrades');
  
  const [activeModal, setActiveModal] = useState<'market' | 'casino' | null>(null);
  
  // CASINO
  const [casinoRolling, setCasinoRolling] = useState(false);
  const [casinoCooldown, setCasinoCooldown] = useState(0);

  // R.0.0.T. & OVERDRIVE
  const [rootMessage, setRootMessage] = useState<string>("Inicjalizacja...");
  const lastActionTime = useRef<number>(Date.now());
  const clickTimestamps = useRef<number[]>([]);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const overdriveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number, tx: number}[]>([]);
  const floatingIdCounter = useRef(0);

  const [isIdle, setIsIdle] = useState(false);
  const [shakeLevel, setShakeLevel] = useState<'none'|'heavy'|'extreme'>('none');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const triggerShake = (level: 'heavy'|'extreme', duration: number) => {
    setShakeLevel(level);
    setTimeout(() => setShakeLevel('none'), duration);
  };

  const reportAction = useCallback(() => {
    lastActionTime.current = Date.now();
    if (rootMessage && !isOverdrive && !casinoRolling) {
      // Don't clear immediately to avoid flickering, but stop idle messages
    }
  }, [rootMessage, isOverdrive, casinoRolling]);

  useEffect(() => {
    localStorage.setItem('hackerMergeState', JSON.stringify({
      coins, scriptCost, grid, upgrades, hasUsedFreeDrop, stats, lastLoginDate, totalDaysLogged
    }));
  }, [coins, scriptCost, grid, upgrades, hasUsedFreeDrop, stats, lastLoginDate, totalDaysLogged]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
      setShowDailyModal(true);
    }
  }, [lastLoginDate]);

  useEffect(() => {
    // R.0.0.T. Idle Check
    const idleInterval = setInterval(() => {
        if (isOverdrive || casinoRolling) {
            setIsIdle(false);
            return;
        }
        const now = Date.now();
        const timeSince = now - lastActionTime.current;
        
        if (timeSince > 5000) {
            setIsIdle(true);
        } else {
            setIsIdle(false);
        }

        if (timeSince > 15000) {
            setRootMessage(ROOT_IDLE_MESSAGES[Math.floor(Math.random() * ROOT_IDLE_MESSAGES.length)]);
            lastActionTime.current = now - 10000; // Trigger again in 5s if still idle
        } else if (timeSince > 3000 && rootMessage !== "Czekam..." && rootMessage !== "Inicjalizacja..." && timeSince <= 15000) {
            setRootMessage("Czekam...");
        }
    }, 1000);
    return () => clearInterval(idleInterval);
  }, [isOverdrive, casinoRolling, rootMessage]);

  const addToast = (msg: string, type: ToastType = 'normal') => {
    const id = toastIdCounter.current++;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const gridIncome = grid.reduce((sum, item) => sum + (item ? getLevelIncome(item.level) : 0), 0);
  const passiveIncomeMultiplier = 1 + (upgrades.cryptoMiner * 1) + (upgrades.trollFarm * 4);
  const basePassiveIncome = gridIncome * passiveIncomeMultiplier;
  
  const baseClickPower = 1 + Math.floor(0.01 * basePassiveIncome) + (upgrades.clickVirus * 5);
  const autoClickerIncome = upgrades.autoClicker * Math.max(1, Math.floor(0.1 * baseClickPower));
  
  const baseTotalIncome = basePassiveIncome + autoClickerIncome;
  
  const isBoostActive = boostTimeLeft > 0;
  const boostMultiplier = isBoostActive ? 3 : 1;
  const prestigeMultiplier = 1 + (stats.quantumCores * 1.0); // +100% per core
  const overdriveMultiplier = isOverdrive ? 50 : 1;
  
  const finalTotalIncome = baseTotalIncome * boostMultiplier * prestigeMultiplier;
  const finalClickPower = baseClickPower * boostMultiplier * prestigeMultiplier * overdriveMultiplier;

  const handleManualAttack = (e: React.MouseEvent) => {
    reportAction();
    vibrate(15);
    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t <= 3000);

    if (clickTimestamps.current.length >= 20 && !isOverdrive) {
        setIsOverdrive(true);
        triggerShake('extreme', 8000);
        setRootMessage("PRZEŁADOWANIE BUFORA!!!");
        if (overdriveTimeoutRef.current) clearTimeout(overdriveTimeoutRef.current);
        overdriveTimeoutRef.current = setTimeout(() => {
            setIsOverdrive(false);
            setShakeLevel('none');
            setRootMessage("System schłodzony.");
            clickTimestamps.current = [];
        }, 8000);
    }

    setCoins(prev => prev + finalClickPower);
    setStats(prev => ({ 
        ...prev, 
        totalClicks: prev.totalClicks + 1,
        lifetimeBits: prev.lifetimeBits + finalClickPower,
        runBits: prev.runBits + finalClickPower
    }));
    
    const id = floatingIdCounter.current++;
    const x = e.clientX + (Math.random() * 40 - 20);
    const y = e.clientY + (Math.random() * 20 - 20) - 20;
    const tx = (Math.random() * 80 - 40);
    
    setFloatingTexts(prev => [...prev, { id, text: `+${formatNum(finalClickPower)}`, x, y, tx }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  const buyUpgrade = (key: keyof typeof upgrades, baseCost: number) => {
    reportAction();
    const currentCost = Math.floor(baseCost * Math.pow(1.5, upgrades[key]));
    if (coins >= currentCost) {
      setCoins(prev => prev - currentCost);
      setUpgrades(prev => ({ ...prev, [key]: prev[key] + 1 }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + finalTotalIncome);
      setStats(prev => ({
          ...prev, 
          lifetimeBits: prev.lifetimeBits + finalTotalIncome,
          runBits: prev.runBits + finalTotalIncome,
          playTimeSeconds: prev.playTimeSeconds + 1
      }));
      setBoostTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      setDropTimer(prev => prev > 0 ? prev - 1 : 0);
      setCasinoCooldown(prev => prev > 0 ? prev - 1 : 0);
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
    reportAction();
    if (coins >= scriptCost) {
      const emptyIndex = grid.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        setCoins(prev => prev - scriptCost);
        setScriptCost(prev => Math.ceil(prev * 1.30));
        
        const newGrid = [...grid];
        newGrid[emptyIndex] = { id: Math.random().toString(36).slice(2, 9), level: 1 };
        setGrid(newGrid);
        setStats(prev => ({ ...prev, maxLevel: Math.max(prev.maxLevel, 1) }));
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    reportAction();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (sourceIndex === targetIndex || isNaN(sourceIndex)) return;

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const sourceItem = newGrid[sourceIndex];
      const targetItem = newGrid[targetIndex];

      if (!sourceItem) return prevGrid;

      if (targetItem && targetItem.level === sourceItem.level) {
        // Gacha Merge Logic
        const rand = Math.random();
        let levelIncrease = 1;
        let isGold = false;
        let isJackpot = false;

        if (rand < 0.02) {
            isJackpot = true;
            levelIncrease = 1;
        } else if (rand < 0.10) {
            isGold = true;
            levelIncrease = 2;
        }

        const nextLevel = sourceItem.level + levelIncrease;
        newGrid[targetIndex] = { id: targetItem.id, level: nextLevel };
        newGrid[sourceIndex] = null;
        
        setMergedIndex(targetIndex);
        setTimeout(() => setMergedIndex(null), 300);
        
        if (isJackpot) {
            vibrate([100, 50, 100, 50, 200, 100, 300]);
            triggerShake('extreme', 1000);
            const jackpotReward = finalTotalIncome * 500;
            setCoins(c => c + jackpotReward);
            setStats(s => ({...s, lifetimeBits: s.lifetimeBits + jackpotReward, runBits: s.runBits + jackpotReward}));
            addToast("KRYTYCZNA KORUPCJA!!!", "critical");
            setRootMessage("Co ty narobiłeś...");
        } else if (isGold) {
            vibrate([50, 50, 150]);
            triggerShake('heavy', 500);
            addToast("ZŁOTY GLITCH!", "gold");
            setRootMessage("Podwójny skok. Niezłe kodowanie.");
        } else {
            vibrate(15);
            addToast("Połączono!", "normal");
        }

        setStats(prev => ({ ...prev, maxLevel: Math.max(prev.maxLevel, nextLevel) }));
      } else {
        newGrid[targetIndex] = sourceItem;
        newGrid[sourceIndex] = targetItem;
      }
      return newGrid;
    });
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverIndex(null);
  };

  const handleClaimDropClick = () => {
    reportAction();
    const reward = Math.max(50, 100 * finalTotalIncome);
    setModalState({
      isOpen: true,
      type: hasUsedFreeDrop ? 'ad' : 'free',
      reward,
      isWatching: false
    });
  };

  const handleClaimModal = () => {
    reportAction();
    if (modalState) {
      if (modalState.type === 'ad') {
        setModalState({ ...modalState, isWatching: true });
        addToast("Ładowanie połączenia...", "gray");
        setTimeout(() => {
          const gain = modalState.reward * 10;
          setCoins(prev => prev + gain);
          setStats(prev => ({
              ...prev,
              lifetimeBits: prev.lifetimeBits + gain,
              runBits: prev.runBits + gain
          }));
          setDropTimer(60);
          setModalState(null);
          addToast(`Epicki Zrzut: +${formatNum(gain)}!`, "gold");
        }, 2000);
      } else {
        const gain = modalState.reward;
        setHasUsedFreeDrop(true);
        setCoins(prev => prev + gain);
        setStats(prev => ({
            ...prev,
            lifetimeBits: prev.lifetimeBits + gain,
            runBits: prev.runBits + gain
        }));
        setDropTimer(60);
        setModalState(null);
        addToast(`Darmowy Zrzut: +${formatNum(gain)}!`, "normal");
      }
    }
  };

  const handleClaimDaily = () => {
    const today = new Date().toDateString();
    const newDayNum = totalDaysLogged + 1;
    const isEpic = newDayNum % 5 === 0;
    const reward = 500 * newDayNum * (isEpic ? 5 : 1) * prestigeMultiplier;
    
    setCoins(prev => prev + reward);
    setStats(prev => ({
        ...prev,
        lifetimeBits: prev.lifetimeBits + reward,
        runBits: prev.runBits + reward
    }));
    setTotalDaysLogged(newDayNum);
    setLastLoginDate(today);
    setShowDailyModal(false);
    addToast(`Odebrano nagrodę: +${formatNum(reward)} B!`, isEpic ? "gold" : "normal");
  };

  const handleResetDaily = () => {
    setLastLoginDate(null);
    setShowDailyModal(true);
  };

  const handleCasino = () => {
    reportAction();
    const bet = Math.max(100, Math.floor(coins * 0.1));
    if (coins < bet || coins < 100) {
      addToast("Brak środków (min. 100)", "error");
      return;
    }
    setCoins(prev => prev - bet);
    setCasinoRolling(true);
    setRootMessage("Losowanie... Liczę na twój ból.");
    
    setTimeout(() => {
        setCasinoRolling(false);
        setCasinoCooldown(5);
        
        const roll = Math.random();
        if (roll < 0.35) {
          vibrate(50);
          addToast("System odrzucił połączenie!", "error");
          setRootMessage("Żałosne. Mogłem sam to przepalić.");
        } else if (roll < 0.65) {
          vibrate(10);
          setCoins(prev => prev + bet);
          addToast("Wychodzisz na zero.", "gray");
          setRootMessage("Nuda. Zero emocji.");
        } else if (roll < 0.90) {
          vibrate([30, 30, 30]);
          setCoins(prev => prev + bet * 2);
          addToast("Udana kradzież!", "normal");
          setRootMessage("Fart. I tak wszystko stracisz.");
        } else {
          vibrate([100, 50, 100, 50, 200, 100, 300]);
          triggerShake('heavy', 1500);
          setCoins(prev => prev + bet * 10);
          addToast("JACKPOT HAKERSKI!!!", "gold");
          setRootMessage("Oszustwo! Prześwietlam twój algorytm.");
        }
    }, 3000);
  };

  const currentPotentialCores = Math.floor(Math.pow(stats.lifetimeBits, 0.4) / 10);
  const newCoresToGain = Math.max(0, currentPotentialCores - stats.quantumCores);

  const handlePrestige = () => {
    vibrate([200, 100, 200, 100, 500, 200, 500]);
    triggerShake('extreme', 2000);
    setStats(prev => ({
        ...prev,
        quantumCores: prev.quantumCores + newCoresToGain,
        prestiges: prev.prestiges + 1,
        runBits: 0,
    }));
    setCoins(0);
    setScriptCost(40);
    setGrid(Array(16).fill(null));
    setUpgrades({
        autoClicker: 0,
        cryptoMiner: 0,
        trollFarm: 0,
        clickVirus: 0,
    });
    addToast("DYSK SFORMATOWANY. ZYSKUJESZ RDZENIE.", "critical");
    setRootMessage("Czuję... moc... Zaczynamy od nowa.");
  };

  const hasEmptySlot = grid.some(slot => slot === null);
  const canBuy = coins >= scriptCost && hasEmptySlot;
  const isCasinoDisabled = casinoRolling || casinoCooldown > 0;

  return (
    <div className={`h-[100dvh] w-full overflow-hidden text-emerald-500 font-mono flex flex-col items-center p-2 pb-[80px] relative selection:bg-emerald-500 selection:text-black transition-colors duration-300 ${
        isOverdrive ? 'bg-red-950/80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-black to-black' 
        : 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-black'
    } ${isOverdrive || shakeLevel === 'extreme' ? 'animate-perlin-extreme' : shakeLevel === 'heavy' ? 'animate-perlin-heavy' : ''}`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        .scanline-effect {
            animation: scanline 4s linear infinite;
        }
        @keyframes popArcFall {
          0% { transform: translate(-50%, 0) scale(1.3); opacity: 1; }
          40% { transform: translate(calc(-50% + (var(--tx) * 0.5)), -60px) scale(1.1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), 20px) scale(0.5); opacity: 0; }
        }
        @keyframes perlinHeavy {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -1px); }
          60% { transform: translate(-2px, -3px); }
          80% { transform: translate(2px, 2px); }
        }
        @keyframes perlinExtreme {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-5px, 4px) rotate(-0.5deg); }
          40% { transform: translate(5px, -3px) rotate(0.5deg); }
          60% { transform: translate(-4px, -5px) rotate(-0.5deg); }
          80% { transform: translate(4px, 5px) rotate(0.5deg); }
        }
        .animate-perlin-heavy { animation: perlinHeavy 0.3s infinite cubic-bezier(0.36,0.07,0.19,0.97); }
        .animate-perlin-extreme { animation: perlinExtreme 0.2s infinite cubic-bezier(0.36,0.07,0.19,0.97); }
        @keyframes idleBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .idle-bob { animation: idleBob 3s ease-in-out infinite; }
        .glitch-text { position: relative; }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
        }
        .glitch-text::before {
          left: 2px; color: #0ff; mix-blend-mode: screen; animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px; color: #f00; mix-blend-mode: screen; animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 10% 0); }
          40% { clip-path: inset(40% 0 50% 0); }
          60% { clip-path: inset(80% 0 5% 0); }
          80% { clip-path: inset(10% 0 70% 0); }
          100% { clip-path: inset(30% 0 40% 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); }
          20% { clip-path: inset(30% 0 20% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(90% 0 5% 0); }
          100% { clip-path: inset(40% 0 30% 0); }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-40"></div>
      
      {isOverdrive && (
          <div className="pointer-events-none absolute inset-0 z-0 bg-red-500/10 scanline-effect opacity-50 mix-blend-overlay"></div>
      )}

      {/* Floating Texts */}
      {floatingTexts.map(f => (
        <div 
          key={f.id} 
          className="fixed pointer-events-none z-[100] text-emerald-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" 
          style={{ 
            left: f.x, top: f.y,
            '--tx': `${f.tx}px`,
            animation: 'popArcFall 1s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          } as React.CSSProperties}
        >
          {f.text}
        </div>
      ))}

      {/* Top Right UI: Toasts */}
      <div className="absolute top-4 right-4 z-[110] flex flex-col items-end gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`bg-black/80 backdrop-blur-md border text-xs sm:text-sm px-3 py-1.5 rounded-xl animate-bounce ${
            t.type === 'error' ? 'border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
            t.type === 'critical' ? 'border-red-500 bg-red-950/80 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] uppercase font-bold' :
            t.type === 'gray' ? 'border-gray-500/50 text-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.3)]' :
            t.type === 'gold' ? 'border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
            'border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          }`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Daily Login Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowDailyModal(false) }}>
          <div className={`w-full max-w-sm rounded-2xl border bg-slate-900/95 p-6 flex flex-col items-center text-center shadow-[0_0_20px_rgba(16,185,129,0.2)] ${
              (totalDaysLogged + 1) % 5 === 0 ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-emerald-500/50'
          }`}>
            <h2 className={`text-2xl font-bold mb-2 uppercase tracking-widest drop-shadow-md ${
                (totalDaysLogged + 1) % 5 === 0 ? 'text-yellow-400 shadow-yellow-500/50' : 'text-emerald-400 shadow-emerald-500/50'
            }`}>
              Dzień {(totalDaysLogged + 1)} w Sieci!
            </h2>
            <p className="text-emerald-500/80 text-sm mb-6">Odbierz swój codzienny przydział danych.</p>
            
            <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border mb-6 animate-pulse ${
                 (totalDaysLogged + 1) % 5 === 0 ? 'border-yellow-400 bg-yellow-900/50 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.5)]' :
                 'border-emerald-400 bg-emerald-900/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            }`}>
                <Gift className="w-8 h-8 mb-2" />
                <span className="font-bold text-sm">
                    +{formatNum(500 * (totalDaysLogged + 1) * ((totalDaysLogged + 1) % 5 === 0 ? 5 : 1) * prestigeMultiplier)} B
                </span>
            </div>
            
            <button 
              onClick={handleClaimDaily}
              className={`w-full py-3 rounded-xl border font-bold uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
                 (totalDaysLogged + 1) % 5 === 0 ? 'border-yellow-500 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-500/30' :
                 'border-emerald-500 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              Odbierz Nagrodę
            </button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowStatsModal(false) }}>
          <div className="w-full max-w-sm rounded-2xl border border-emerald-500/50 bg-slate-900/95 p-4 sm:p-6 flex flex-col shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Centrum Analizy
              </h2>
              <button onClick={() => setShowStatsModal(false)} className="text-emerald-500/50 hover:text-emerald-400"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="text-emerald-500/80 text-xs sm:text-sm uppercase tracking-wider">Rdzenie Kwant.:</span>
                <span className="text-cyan-400 font-bold text-xs sm:text-sm drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                    {stats.quantumCores} <span className="text-[10px] opacity-70">(+{stats.quantumCores * 100}%)</span>
                </span>
              </div>
              <div className="flex justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="text-emerald-500/80 text-xs sm:text-sm uppercase tracking-wider">Max Wirus:</span>
                <span className="text-emerald-400 font-bold text-xs sm:text-sm">Lvl {stats.maxLevel}</span>
              </div>
              <div className="flex justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="text-emerald-500/80 text-xs sm:text-sm uppercase tracking-wider">Czas w Grze:</span>
                <span className="text-emerald-400 font-bold text-xs sm:text-sm">{formatTime(stats.playTimeSeconds)}</span>
              </div>
              <div className="flex justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-900/30">
                <span className="text-emerald-500/80 text-xs sm:text-sm uppercase tracking-wider">Resety (FBI):</span>
                <span className="text-emerald-400 font-bold text-xs sm:text-sm">{stats.prestiges}</span>
              </div>
            </div>

            <div className="flex items-end justify-between h-20 gap-1 p-2 bg-black/40 rounded-xl border border-emerald-900/30">
              {[...Array(15)].map((_, i) => {
                const h = 20 + Math.abs(Math.sin(i * 0.8) * 30) + (i * 3);
                return (
                  <div key={i} className="w-full bg-emerald-500/50 rounded-t-sm animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s`, animationDuration: '1.5s' }}></div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Drop Modal (Ad/Free) */}
      {modalState && modalState.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalState(null) }}>
          <div className={`w-full max-w-sm rounded-2xl border p-4 sm:p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden ${
            modalState.type === 'ad' 
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
            ) : modalState.type === 'ad' ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-yellow-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
                  Zabezpieczony Zrzut
                </h2>
                <p className="text-emerald-300/80 text-xs sm:text-sm mb-6">Wymagana autoryzacja strumieniowa, by odszyfrować dane.</p>
                <div className="flex flex-col gap-3 w-full relative z-10">
                  <button 
                    onClick={() => handleClaimModal()}
                    className="w-full py-4 rounded-xl border border-white/20 bg-gradient-to-r from-emerald-900 to-white/90 text-black font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]"
                  >
                    <Play className="w-6 h-6" /> Obejrzyj Wideo (Zysk x10)
                  </button>
                  <button 
                    onClick={() => setModalState(null)}
                    className="text-[10px] sm:text-xs text-emerald-500/50 hover:text-emerald-400 transition-colors uppercase tracking-wider py-2"
                  >
                    Zamknij
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-emerald-400 mb-2 uppercase tracking-widest">
                  Pierwszy Zrzut
                </h2>
                <p className="text-emerald-500/60 text-xs sm:text-sm mb-6">Paczka danych bez zabezpieczeń. Darmowy przydział od sieci.</p>
                <button 
                  onClick={() => handleClaimModal()}
                  className="w-full py-3 rounded-xl border border-emerald-500/50 bg-emerald-900/30 text-emerald-400 font-bold uppercase tracking-wider hover:bg-emerald-800/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" /> Odbierz Darmowy Zrzut
                </button>
                <button 
                  onClick={() => setModalState(null)}
                  className="text-[10px] sm:text-xs text-emerald-500/50 hover:text-emerald-400 transition-colors uppercase tracking-wider py-2 mt-2"
                >
                  Zamknij
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dark Market Modal */}
      {activeModal === 'market' && (
        <div className="fixed inset-0 z-[40] bg-slate-950/95 flex flex-col items-center p-4 pt-8 pb-24 overflow-y-auto w-full" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
           <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-emerald-400 uppercase tracking-widest shadow-emerald-500/50 drop-shadow-md">Dark Market</h2>
                  <button onClick={() => setActiveModal(null)} className="text-emerald-500/50 hover:text-emerald-400"><X size={28}/></button>
              </div>

              <div className="flex gap-2 mb-4 w-full">
                <button 
                  onClick={() => setMarketTab('upgrades')} 
                  className={`flex-1 py-2 rounded-lg text-sm sm:text-base uppercase tracking-widest font-bold border transition-colors ${marketTab === 'upgrades' ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' : 'bg-black/40 border-emerald-900/40 text-emerald-700 hover:bg-emerald-950'}`}
                >Ulepszenia</button>
                <button 
                  onClick={() => setMarketTab('prestige')} 
                  className={`flex-1 py-2 rounded-lg text-sm sm:text-base uppercase tracking-widest font-bold border transition-colors ${marketTab === 'prestige' ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-black/40 border-red-900/40 text-red-700 hover:bg-red-950'}`}
                >Rdzenie (Prestiż)</button>
              </div>

              {marketTab === 'upgrades' ? (
                  <div className="flex flex-col gap-3">
                    <MarketItem 
                      title="Wirus Wciskający" 
                      desc="+5 kliku" 
                      baseCost={1000} 
                      count={upgrades.clickVirus} 
                      coins={coins}
                      icon={MousePointerClick}
                      animClass="animate-bounce text-emerald-400"
                      onClick={() => buyUpgrade('clickVirus', 1000)} 
                    />
                    <MarketItem 
                      title="Auto-Clicker" 
                      desc="10% klik/s" 
                      baseCost={1500}
                      count={upgrades.autoClicker} 
                      coins={coins}
                      icon={Bot}
                      animClass="animate-bounce text-blue-400"
                      onClick={() => buyUpgrade('autoClicker', 1500)} 
                    />
                    <MarketItem 
                      title="Koparka Krypto" 
                      desc="Zarobek x2" 
                      baseCost={20000} 
                      count={upgrades.cryptoMiner} 
                      coins={coins}
                      icon={Cpu}
                      animClass="animate-[spin_3s_linear_infinite] text-purple-400"
                      onClick={() => buyUpgrade('cryptoMiner', 20000)} 
                    />
                    <MarketItem 
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
              ) : (
                  <div className="flex flex-col gap-4 border border-red-900/50 bg-red-950/20 p-4 rounded-xl">
                      <h3 className="text-lg sm:text-xl font-bold text-red-500 uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                          <AlertTriangle className="w-5 h-5"/> Namierzanie FBI
                      </h3>
                      <p className="text-xs sm:text-sm text-red-300/80">
                          Sformatuj dysk, aby uciec przed FBI. Stracisz obecne monety, planszę i ulepszenia. W zamian uzyskasz Rdzenie Kwantowe, dające potężny bonus.
                      </p>
                      
                      <div className="w-full bg-black/60 rounded-full h-5 sm:h-6 border border-red-900/50 relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: `${Math.min(100, (stats.lifetimeBits / 10000000) * 100)}%` }}></div>
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white z-10 drop-shadow-md">
                              {Math.floor(Math.min(100, (stats.lifetimeBits / 10000000) * 100))}% ( {formatNum(stats.lifetimeBits)} / 10M )
                          </div>
                      </div>
                      
                      <div className="bg-black/40 p-3 rounded-lg border border-red-900/30 text-sm text-red-300 flex flex-col gap-1">
                          <div className="flex justify-between"><span>Posiadane Rdzenie:</span><span className="font-bold text-cyan-400">{stats.quantumCores}</span></div>
                          <div className="flex justify-between"><span>Obecny Bonus:</span><span className="font-bold text-cyan-400">+{stats.quantumCores * 100}% zysku</span></div>
                          <div className="flex justify-between border-t border-red-900/30 pt-1 mt-1"><span>Nowe Rdzenie po formacie:</span><span className="font-bold text-emerald-400">+{newCoresToGain}</span></div>
                      </div>
                      
                      <button 
                          onClick={handlePrestige}
                          disabled={stats.lifetimeBits < 10000000}
                          className={`w-full py-3 rounded-xl border font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                              stats.lifetimeBits >= 10000000
                                  ? 'border-red-500 bg-red-600/30 text-red-400 hover:bg-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 animate-pulse' 
                                  : 'border-red-900/50 bg-red-950/20 text-red-800 cursor-not-allowed'
                          }`}
                      >
                          <AlertTriangle className="w-5 h-5" />
                          {stats.lifetimeBits >= 10000000 ? `[ 🚨 FORMATUJ DYSK ]` : 'ZBYT MAŁY ŚLAD'}
                      </button>
                  </div>
              )}
           </div>
        </div>
      )}

      {/* Casino Modal */}
      {activeModal === 'casino' && (
        <div className="fixed inset-0 z-[40] bg-slate-950/95 flex flex-col items-center justify-center p-4 pb-24 overflow-y-auto w-full" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
           <div className="w-full max-w-lg flex flex-col items-center relative">
              <div className="absolute -top-16 right-0">
                  <button onClick={() => setActiveModal(null)} className="text-emerald-500/50 hover:text-emerald-400"><X size={28}/></button>
              </div>
              <h2 className="text-3xl font-bold text-emerald-400 mb-6 uppercase tracking-widest shadow-emerald-500/50 drop-shadow-md flex items-center gap-3">
                  <Dices size={36}/> Kasyno
              </h2>
              <p className="text-emerald-500/60 text-center text-sm mb-12 max-w-xs">Ryzykujesz swoimi Bitami. Szansa na utratę kapitału, zwrot, podwojenie, a nawet nagrodę główną.</p>
              
              <button 
                onClick={handleCasino}
                disabled={isCasinoDisabled}
                className={`w-full max-w-xs py-8 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                    casinoRolling 
                        ? 'border-orange-500/50 bg-orange-900/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-not-allowed'
                    : casinoCooldown > 0
                        ? 'border-red-900/50 bg-red-950/30 text-red-500 cursor-not-allowed'
                    : 'border-yellow-500/50 bg-yellow-900/30 text-yellow-400 font-bold uppercase tracking-wider hover:bg-yellow-800/40 active:scale-95 shadow-[0_0_30px_rgba(234,179,8,0.2)]'
                }`}
              >
                {casinoRolling ? (
                    <span className="text-2xl flex items-center gap-2"><Network className="animate-spin"/> Łamanie zabezpieczeń...</span>
                ) : casinoCooldown > 0 ? (
                    <span className="text-xl flex items-center gap-2"><Lock/> Blokada systemowa: {casinoCooldown}s</span>
                ) : (
                    <>
                        <span className="text-3xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] flex items-center gap-2"><Dices/> ZAGRAJ</span>
                        <span className="text-xs opacity-70">Stawka: {formatNum(Math.max(100, Math.floor(coins * 0.1)))} B (Min: 100)</span>
                    </>
                )}
              </button>
           </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[64px] z-[45] bg-black/90 border-t border-emerald-500/50 flex justify-around items-center px-2 pb-safe backdrop-blur-md">
        <button onClick={() => setActiveModal(null)} className={`flex flex-col items-center w-20 transition-colors ${activeModal === null ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Terminal className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Terminal</span>
        </button>
        <button onClick={() => setActiveModal('market')} className={`flex flex-col items-center w-20 transition-colors ${activeModal === 'market' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Market</span>
        </button>
        <button onClick={() => setActiveModal('casino')} className={`flex flex-col items-center w-20 transition-colors ${activeModal === 'casino' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Dices className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Kasyno</span>
        </button>
      </div>

      {/* Header Panel */}
      <div className="w-full max-w-lg mb-1 border border-emerald-500/30 rounded-xl p-2 bg-black/40 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-1">
          <h1 className="text-sm sm:text-base font-bold tracking-widest uppercase shadow-emerald-500/50 drop-shadow-md truncate">
            TERMINAL_OS
          </h1>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
                onClick={() => { if (!isBoostActive) setBoostTimeLeft(30); reportAction(); }}
                disabled={isBoostActive}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase transition-colors ${
                  isBoostActive 
                    ? 'border-yellow-900/50 text-yellow-700/50 bg-yellow-900/10 cursor-not-allowed' 
                    : 'border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 cursor-pointer shadow-[0_0_8px_rgba(234,179,8,0.3)] animate-pulse'
                }`}
            >
                {isBoostActive ? `[ ⏳ ${boostTimeLeft}s ]` : '[ 💰 BOOST x3 ]'}
            </button>
            <button onClick={() => setShowStatsModal(true)} className="bg-black/60 backdrop-blur-md border border-emerald-500/50 text-emerald-400 p-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:bg-emerald-900/40 active:scale-95 transition-all flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold hidden sm:inline">Rdzenie: {stats.quantumCores}</span>
                <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <div className="bg-black/60 backdrop-blur-md border border-emerald-500/50 text-emerald-400 p-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)] flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center text-xs sm:text-sm gap-2 bg-black/40 px-2 py-1 rounded-lg border border-emerald-900/40">
          <div className="font-bold">
            Bity: <span className="text-emerald-300">{formatNum(Math.floor(coins))}</span>
          </div>
          <div>
            Kopanie: <span className="text-emerald-300">{formatNum(finalTotalIncome)}</span>/s
          </div>
        </div>
      </div>

      {/* R.0.0.T. Panel */}
      <div className={`w-full max-w-lg mb-1 border rounded-xl p-2 bg-black/60 backdrop-blur-md relative z-10 flex items-center gap-3 transition-colors duration-300 ${isOverdrive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}>
          <div className={`p-1.5 rounded-lg border ${isOverdrive ? 'bg-red-900/50 border-red-500 text-red-400 animate-pulse' : 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'}`}>
              <Skull className="w-5 h-5" style={{ filter: 'drop-shadow(-2px 0px 0px rgba(0,255,255,0.5)) drop-shadow(2px 0px 0px rgba(255,0,0,0.5))' }} />
          </div>
          <div className="flex flex-col overflow-hidden">
              <span className={`text-[9px] uppercase font-bold tracking-widest ${isOverdrive ? 'text-red-500' : 'text-emerald-600'}`}>R.0.0.T. AI</span>
              <span 
                className={`text-xs sm:text-sm font-medium truncate ${isOverdrive ? 'text-red-400' : 'text-emerald-300'} ${isIdle ? 'glitch-text' : ''}`}
                data-text={rootMessage}
                style={{ textShadow: '-1.5px 0px 0px rgba(0, 255, 255, 0.6), 1.5px 0px 0px rgba(255, 0, 0, 0.6)' }}
              >
                  {rootMessage}
              </span>
          </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full max-w-lg relative z-10 mb-1">
        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1.5 sm:p-2 border border-emerald-500/20 rounded-2xl bg-black/40 backdrop-blur-md aspect-square w-full max-w-[320px] sm:max-w-[380px] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {grid.map((slot, index) => {
            const isMerged = mergedIndex === index;
            const config = slot ? getLevelConfig(slot.level) : null;
            const Icon = config ? config.icon : null;
            return (
              <div
                key={index}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`w-full h-full border border-emerald-900/40 rounded-xl bg-slate-900/30 flex items-center justify-center relative transition-transform duration-200 aspect-square ${dragOverIndex === index ? 'scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20' : ''}`}
              >
                {slot && config && Icon && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    className={`absolute inset-0 sm:inset-0.5 border border-emerald-500/30 rounded-xl bg-slate-900/80 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-emerald-900/30 hover:border-emerald-500/50 shadow-inner ${
                      isMerged 
                        ? 'scale-[1.25] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200' 
                        : isIdle ? 'idle-bob transition-none' : 'transition-all duration-300'
                    }`}
                    style={isIdle ? { animationDelay: `${index * 0.15}s` } : {}}
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
            <Gift className="w-4 h-4" /> [ ZDEKODUJ ZRZUT Z SIECI ]
          </button>
        )}
        
        <div className="w-full text-[9px] sm:text-[10px] text-emerald-500/60 flex items-center gap-2 px-2 overflow-hidden bg-black/20 rounded-lg py-0.5 border border-emerald-900/30">
          <span className="animate-pulse">{'>_'}</span>
          <span className="truncate">{logText}</span>
        </div>
      </div>

      {/* Attack Button */}
      <button
        onClick={handleManualAttack}
        className={`w-full max-w-lg mb-0.5 relative z-10 px-2 py-1.5 sm:py-2 rounded-xl border backdrop-blur-sm font-bold text-sm sm:text-base uppercase tracking-widest flex-shrink-0 flex items-center justify-center gap-2 select-none transition-[transform,background-color,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.8,-0.5,0.2,1.8)] active:scale-y-[0.85] active:scale-x-[1.05] ${
            isOverdrive 
            ? 'border-red-500 bg-red-600 text-black shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse'
            : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-900/60 active:bg-emerald-600 active:text-black cursor-pointer'
        }`}
      >
        <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> [ MANUALNY ATAK ] (+{formatNum(finalClickPower)})
      </button>

      {/* Footer / Buy Script */}
      <div className="w-full max-w-lg flex flex-col items-center flex-shrink-0 pb-1 relative z-10">
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`w-full rounded-xl relative z-10 px-4 py-1.5 sm:py-2 border font-bold text-sm sm:text-base transition-all uppercase tracking-wider shadow-lg ${
            canBuy 
              ? 'border-emerald-500/80 text-emerald-950 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer' 
              : 'border-emerald-900/50 text-emerald-800 bg-emerald-950/20 cursor-not-allowed'
          }`}
        >
          Kompiluj Skrypt ({formatNum(scriptCost)})
        </button>
        
        <div className="h-4 mt-0.5 flex items-center justify-between w-full px-2">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            {!hasEmptySlot && (
              <div className="text-red-400 animate-pulse font-bold uppercase relative z-10 text-[10px] sm:text-xs tracking-widest drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
                [ Brak Miejsca ]
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-end">
             <button onClick={handleResetDaily} className="text-[8px] text-emerald-900/60 hover:text-emerald-500/80 transition-colors">[Dev: Reset Daily]</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketItem({ title, desc, baseCost, count, icon: Icon, animClass, coins, onClick }: any) {
  const currentCost = Math.floor(baseCost * Math.pow(1.5, count));
  const canAfford = coins >= currentCost;
  
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full rounded-xl border p-3 flex items-center justify-between transition-all ${
        canAfford 
          ? 'border-emerald-500/40 text-emerald-400 bg-black/40 backdrop-blur-md hover:bg-emerald-900/40 cursor-pointer active:scale-95 hover:border-emerald-500/60' 
          : 'border-emerald-900/30 text-emerald-800 bg-black/20 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-black/50 border border-emerald-900/30 ${count > 0 ? animClass : 'opacity-50'}`}>
           <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-start">
            <span className="font-bold text-sm sm:text-base">{title}</span>
            <span className="text-[10px] sm:text-xs opacity-70">{desc}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
          <span className="font-bold text-sm sm:text-base text-emerald-300">{formatNum(currentCost)} B</span>
          <span className="text-[10px] sm:text-xs opacity-70">Posiadasz: {count} szt.</span>
      </div>
    </button>
  );
}
