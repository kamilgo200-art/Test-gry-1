import React, { useState } from 'react';
import {
  Rocket,
  Atom,
  X,
  Zap,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
  Star
} from 'lucide-react';

export type CosmicSlot = {
  id: string;
  level: number;
} | null;

export type CosmicState = {
  qubits: number;
  lifetimeQubits: number;
  cosmicGrid: CosmicSlot[];
  orbitalWarpLevel: number;
  qubitOverdriveLevel: number;
  stargateLevel: number;
};

const COSMIC_NAMES: Record<number, string> = {
  1: 'Qubit.Bit',
  2: 'Superpos.v1',
  3: 'Entangle.Hook',
  4: 'Q-Teleport',
  5: 'D-Wave.Pulse',
  6: 'Shor.Breaker',
  7: 'Grover.Search',
  8: 'Orbital.Node',
  9: 'Void.Resonator',
  10: 'Cosmic.Singularity'
};

const COSMIC_COLORS = [
  'text-cyan-400 border-cyan-500/40 bg-cyan-950/30',
  'text-indigo-400 border-indigo-500/40 bg-indigo-950/30',
  'text-purple-400 border-purple-500/40 bg-purple-950/30',
  'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/30',
  'text-pink-400 border-pink-500/40 bg-pink-950/30',
  'text-rose-400 border-rose-500/40 bg-rose-950/30',
  'text-amber-400 border-amber-500/40 bg-amber-950/30',
  'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
  'text-teal-300 border-teal-400/50 bg-teal-950/40 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]',
  'text-amber-300 border-amber-400/80 bg-amber-950/50 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
];

interface CosmicModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  qubits: number;
  lifetimeQubits: number;
  cosmicGrid: CosmicSlot[];
  orbitalWarpLevel: number;
  qubitOverdriveLevel: number;
  stargateLevel: number;
  onBuyCosmicProbe: () => void;
  probeCost: number;
  onMergeCosmic: (sourceIdx: number, targetIdx: number) => void;
  onBuyUpgrade: (type: 'warp' | 'overdrive' | 'stargate') => void;
  onCosmicCollapsePrestige: () => void;
  qubitPrestigeGain: number;
  formatNum: (num: number) => string;
}

export const CosmicOrbitalModal: React.FC<CosmicModalProps> = ({
  isOpen,
  onClose,
  coins,
  qubits,
  lifetimeQubits,
  cosmicGrid,
  orbitalWarpLevel,
  qubitOverdriveLevel,
  stargateLevel,
  onBuyCosmicProbe,
  probeCost,
  onMergeCosmic,
  onBuyUpgrade,
  onCosmicCollapsePrestige,
  qubitPrestigeGain,
  formatNum,
}) => {
  const [selectedTab, setSelectedTab] = useState<'grid' | 'upgrades' | 'collapse'>('grid');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const warpCost = Math.floor(10 * Math.pow(2.2, orbitalWarpLevel));
  const overdriveCost = Math.floor(25 * Math.pow(2.5, qubitOverdriveLevel));
  const stargateCost = Math.floor(100 * Math.pow(3, stargateLevel));

  const emptySlotCount = cosmicGrid.filter(s => s === null).length;
  const canBuyProbe = qubits >= probeCost && emptySlotCount > 0;

  // Qubit total generation per sec from cosmic grid
  const cosmicIncomePerSec = cosmicGrid.reduce((acc, slot) => {
    if (!slot) return acc;
    const base = Math.pow(2.5, slot.level - 1);
    const warpBonus = 1 + orbitalWarpLevel * 0.5;
    return acc + base * warpBonus;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-start p-3 sm:p-5 overflow-y-auto w-full select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-cyan-500/60 hover:text-cyan-300 rounded-xl hover:bg-cyan-950/40 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-cyan-900/50 pb-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-400 animate-pulse">
            <Rocket className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 uppercase tracking-widest">
                Stacja Kosmiczna
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-400/40 text-cyan-300">
                Wymiar Kwantowy
              </span>
            </div>
            <p className="text-cyan-400/70 text-xs font-mono">
              Satelity orbitują i generują Qubity (Kwantowe Bity)
            </p>
          </div>
        </div>

        {/* Qubit Balance & Stat Banner */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-cyan-400/70 uppercase font-bold tracking-wider flex items-center gap-1">
              <Atom className="w-3.5 h-3.5 text-cyan-400" /> Saldo Qubitów
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-0.5 flex items-baseline gap-1">
              <span>{formatNum(Math.floor(qubits))}</span>
              <span className="text-xs text-cyan-500/70 font-normal">QB</span>
            </div>
            <span className="text-[10px] text-cyan-500/80 font-mono mt-0.5">
              +{formatNum(cosmicIncomePerSec)} QB/s
            </span>
          </div>

          <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-purple-400/70 uppercase font-bold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Bonus do Ziemi
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5 flex items-baseline gap-1">
              <span>+{(lifetimeQubits * (20 + qubitOverdriveLevel * 5)).toFixed(0)}%</span>
            </div>
            <span className="text-[10px] text-purple-400/70 font-mono mt-0.5">
              Do wszystkich Bitów na Ziemi!
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 w-full">
          <button
            onClick={() => setSelectedTab('grid')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
              selectedTab === 'grid'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-black/40 border-cyan-900/40 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-950/40'
            }`}
          >
            <Layers className="w-4 h-4" /> Satelity (Merge)
          </button>
          <button
            onClick={() => setSelectedTab('upgrades')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
              selectedTab === 'upgrades'
                ? 'bg-indigo-950 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-black/40 border-indigo-900/40 text-indigo-600 hover:text-indigo-400 hover:bg-indigo-950/40'
            }`}
          >
            <Zap className="w-4 h-4" /> Napęd Kwantowy
          </button>
          <button
            onClick={() => setSelectedTab('collapse')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
              selectedTab === 'collapse'
                ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-black/40 border-purple-900/40 text-purple-600 hover:text-purple-400 hover:bg-purple-950/40'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Kolaps Kosmiczny
          </button>
        </div>

        {/* Tab Content: Grid / Satellites */}
        {selectedTab === 'grid' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-2 bg-black/60 p-2 sm:p-3 border border-cyan-900/40 rounded-2xl aspect-square w-full max-h-[320px]">
              {cosmicGrid.map((slot, idx) => {
                const colorClass = slot ? COSMIC_COLORS[(slot.level - 1) % COSMIC_COLORS.length] : 'border-cyan-950/30 bg-slate-900/20';
                const name = slot ? (COSMIC_NAMES[slot.level] || `Q-Orbital v${slot.level}`) : '';
                return (
                  <div
                    key={idx}
                    draggable={!!slot}
                    onDragStart={() => setDraggedIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex !== null && draggedIndex !== idx) {
                        onMergeCosmic(draggedIndex, idx);
                      }
                      setDraggedIndex(null);
                    }}
                    onClick={() => {
                      if (draggedIndex === null) {
                        if (slot) setDraggedIndex(idx);
                      } else {
                        if (draggedIndex !== idx) {
                          onMergeCosmic(draggedIndex, idx);
                        }
                        setDraggedIndex(null);
                      }
                    }}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all cursor-pointer select-none ${colorClass} ${
                      draggedIndex === idx ? 'scale-95 border-yellow-400 ring-2 ring-yellow-400/50' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {slot ? (
                      <>
                        <div className="text-[9px] sm:text-[10px] font-black uppercase text-cyan-300 absolute top-1 left-1.5">
                          Lvl {slot.level}
                        </div>
                        <Atom className="w-5 h-5 sm:w-7 sm:h-7 animate-spin-slow" />
                        <span className="text-[8px] sm:text-[9px] font-mono truncate w-full text-center leading-none mt-1 font-bold">
                          {name}
                        </span>
                        <span className="text-[7px] text-cyan-400/70 font-mono">
                          +{formatNum(Math.pow(2.5, slot.level - 1))} QB/s
                        </span>
                      </>
                    ) : (
                      <span className="text-cyan-950 text-xs font-mono">+</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Launch Probe Button */}
            <div className="flex flex-col gap-1.5 mt-1">
              <button
                onClick={onBuyCosmicProbe}
                disabled={!canBuyProbe}
                className={`w-full py-3 rounded-xl border font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  canBuyProbe
                    ? 'border-cyan-400 bg-cyan-600/30 text-cyan-300 hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 cursor-pointer'
                    : 'border-cyan-900/30 bg-slate-900/30 text-cyan-800 cursor-not-allowed'
                }`}
              >
                <Rocket className="w-4 h-4" /> Wystrzel Sondę Kwantową ({formatNum(probeCost)} Qubitów)
              </button>
              {emptySlotCount === 0 && (
                <div className="text-center text-[11px] text-amber-400 font-bold">
                  Brak miejsca w orbicie! Połącz dwie identyczne sondy (złap lub kliknij).
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Upgrades */}
        {selectedTab === 'upgrades' && (
          <div className="flex flex-col gap-3">
            {/* Upgrade 1: Orbital Warp */}
            <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-cyan-300 uppercase">
                    Orbitalny Warp (Poz. {orbitalWarpLevel})
                  </div>
                  <div className="text-xs text-cyan-500/80 font-mono">
                    +{orbitalWarpLevel * 50}% do szybkości generowania Qubitów
                  </div>
                </div>
              </div>
              <button
                onClick={() => onBuyUpgrade('warp')}
                disabled={qubits < warpCost}
                className={`px-3 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                  qubits >= warpCost
                    ? 'border-cyan-400 bg-cyan-600/30 text-cyan-300 hover:bg-cyan-500/40 active:scale-95'
                    : 'border-cyan-900/30 bg-slate-900/20 text-cyan-800 cursor-not-allowed'
                }`}
              >
                {formatNum(warpCost)} QB
              </button>
            </div>

            {/* Upgrade 2: Qubit Overdrive */}
            <div className="bg-black/50 border border-indigo-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-indigo-300 uppercase">
                    Kwantowy Nadajnik (Poz. {qubitOverdriveLevel})
                  </div>
                  <div className="text-xs text-indigo-400/80 font-mono">
                    Zwiększa bonus dla Ziemi do +{20 + qubitOverdriveLevel * 5}% za każdy Qubit
                  </div>
                </div>
              </div>
              <button
                onClick={() => onBuyUpgrade('overdrive')}
                disabled={qubits < overdriveCost}
                className={`px-3 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                  qubits >= overdriveCost
                    ? 'border-indigo-400 bg-indigo-600/30 text-indigo-300 hover:bg-indigo-500/40 active:scale-95'
                    : 'border-indigo-900/30 bg-slate-900/20 text-indigo-800 cursor-not-allowed'
                }`}
              >
                {formatNum(overdriveCost)} QB
              </button>
            </div>

            {/* Upgrade 3: Stargate Resonance */}
            <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-purple-300 uppercase">
                    Wrota Gwiezdne (Poz. {stargateLevel})
                  </div>
                  <div className="text-xs text-purple-400/80 font-mono">
                    Kradnie stałe {stargateLevel * 2}% bitów ze stacji kosmicznej co sekundę
                  </div>
                </div>
              </div>
              <button
                onClick={() => onBuyUpgrade('stargate')}
                disabled={qubits < stargateCost}
                className={`px-3 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                  qubits >= stargateCost
                    ? 'border-purple-400 bg-purple-600/30 text-purple-300 hover:bg-purple-500/40 active:scale-95'
                    : 'border-purple-900/30 bg-slate-900/20 text-purple-800 cursor-not-allowed'
                }`}
              >
                {formatNum(stargateCost)} QB
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Cosmic Collapse / Reset for Mega Qubits */}
        {selectedTab === 'collapse' && (
          <div className="flex flex-col gap-4">
            <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 flex flex-col gap-2">
              <h3 className="text-sm font-bold uppercase text-purple-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400" /> Super-Kolaps Czasoprzestrzeni
              </h3>
              <p className="text-xs text-purple-300/70 font-mono leading-relaxed">
                Przetwórz całą masę Bitów zebraną na Ziemi w skoncentrowane Qubity. Zresetuje to jedynie
                Twoje naziemne bity, ale zachowa sondy kosmiczne i zapewni potężny skok kwantowy!
              </p>
            </div>

            <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-purple-400 font-mono">
                <span>Zgromadzona energia ziemska:</span>
                <span className="font-bold text-white">{formatNum(coins)} B</span>
              </div>
              <div className="flex justify-between items-center text-xs text-purple-400 font-mono">
                <span>Wymagane do kolapsu:</span>
                <span className="font-bold text-cyan-300">100,000,000 B (100M)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-purple-400 font-mono border-t border-purple-900/50 pt-2 mt-1">
                <span>Zyskasz po kolapsie:</span>
                <span className="font-bold text-emerald-400 text-sm">+{formatNum(qubitPrestigeGain)} Qubitów</span>
              </div>
            </div>

            <button
              onClick={onCosmicCollapsePrestige}
              disabled={coins < 100000000}
              className={`w-full py-4 rounded-xl border font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                coins >= 100000000
                  ? 'border-purple-400 bg-purple-600/30 text-purple-300 hover:bg-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-95 animate-pulse cursor-pointer'
                  : 'border-purple-900/30 bg-slate-900/20 text-purple-900 cursor-not-allowed'
              }`}
            >
              <Atom className="w-5 h-5" />
              {coins >= 100000000 ? '[ WYWOŁAJ KOLAPS KWANTOWY ]' : 'ZBYT MAŁO ENERGII (MIN. 100M B)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
