/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

type Item = {
  id: string;
  level: number;
};

type GridSlot = Item | null;

const LEVEL_NAMES: Record<number, string> = {
  1: '.bat',
  2: '.exe',
  3: 'Trojan',
  4: 'Ransomware',
  5: 'Worm',
  6: 'Rootkit',
  7: 'Botnet',
  8: 'Zero-Day',
  9: 'AI.sys'
};

const LEVEL_INCOME: Record<number, number> = {
  1: 1,
  2: 3,
  3: 10,
  4: 35,
  5: 120,
  6: 400,
  7: 1500,
  8: 5000,
  9: 20000,
};

export default function App() {
  const [coins, setCoins] = useState(100);
  const [scriptCost, setScriptCost] = useState(50);
  const [grid, setGrid] = useState<GridSlot[]>(Array(16).fill(null));

  const totalIncome = grid.reduce((sum, item) => {
    return sum + (item ? LEVEL_INCOME[item.level] || 0 : 0);
  }, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + totalIncome);
    }, 1000);
    return () => clearInterval(interval);
  }, [totalIncome]);

  const handleBuy = () => {
    if (coins >= scriptCost) {
      const emptyIndex = grid.findIndex(slot => slot === null);
      if (emptyIndex !== -1) {
        setCoins(prev => prev - scriptCost);
        setScriptCost(prev => prev * 1.2);
        
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

  const hasEmptySlot = grid.some(slot => slot === null);
  const canBuy = coins >= scriptCost && hasEmptySlot;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center py-12 px-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-40"></div>
      
      <div className="w-full max-w-lg mb-8 border-2 border-green-500 p-6 bg-black/80 relative z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
        <h1 className="text-3xl font-bold mb-4 text-center tracking-widest uppercase shadow-green-500/50 drop-shadow-md">
          TERMINAL_OS v1.0
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-center text-xl gap-4">
          <div className="font-bold">
            HackerCoiny: <span className="text-green-300">{Math.floor(coins)}</span>
          </div>
          <div>
            Zarobek: <span className="text-green-300">{totalIncome}</span> / sek
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 relative z-10 p-4 border-2 border-green-900 bg-green-950/20">
        {grid.map((slot, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="w-16 h-16 sm:w-24 sm:h-24 border border-green-800 bg-black flex items-center justify-center relative transition-colors"
          >
            {slot && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                className="absolute inset-1 border border-green-500 bg-black flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-green-900/40 transition-colors group"
              >
                <div className="text-[10px] sm:text-xs font-bold opacity-70 group-hover:opacity-100">
                  Lvl {slot.level}
                </div>
                <div className="text-xs sm:text-sm font-bold text-center leading-tight px-1 text-green-300">
                  {LEVEL_NAMES[slot.level] || `Lvl ${slot.level}`}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleBuy}
        disabled={!canBuy}
        className={`relative z-10 px-8 py-4 border-2 font-bold text-lg sm:text-xl transition-all uppercase tracking-wider ${
          canBuy 
            ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] cursor-pointer' 
            : 'border-green-900 text-green-900 cursor-not-allowed'
        }`}
      >
        Napisz Skrypt (Koszt: {Math.floor(scriptCost)})
      </button>
      
      {!hasEmptySlot && (
        <div className="mt-6 text-red-500 animate-pulse font-bold uppercase relative z-10 text-xl tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
          [ BŁĄD: Brak miejsca na dysku ]
        </div>
      )}
    </div>
  );
}