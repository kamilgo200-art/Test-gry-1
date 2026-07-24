import React, { useState, useMemo, useEffect } from 'react';

export const CandlestickChart = () => {
    const [interval, setChartInterval] = useState('1M');
    const [tick, setTick] = useState(0);

    // Update real-time 
    useEffect(() => {
        if (interval !== '1M' && interval !== '5M') return;
        const speed = interval === '1M' ? 1000 : 3000;
        const timer = setInterval(() => {
            setTick(t => t + 1);
        }, speed);
        return () => clearInterval(timer);
    }, [interval]);
    
    // Generate some fake OHLC data based on interval to make it look alive
    const data = useMemo(() => {
        const seed = interval === '1M' ? 1 : interval === '5M' ? 5 : interval === '1H' ? 60 : 1440;
        const candles = [];
        let currentPrice = 64000;
        
        for (let i = 0; i < 30; i++) {
            const volatility = seed * 10 + Math.random() * 50;
            const open = currentPrice;
            const close = open + (Math.random() - 0.48) * volatility * 2;
            const high = Math.max(open, close) + Math.random() * volatility;
            const low = Math.min(open, close) - Math.random() * volatility;
            
            candles.push({ open, high, low, close });
            currentPrice = close;
        }
        
        // Add dynamic latest tick
        if (tick > 0) {
            const last = candles[candles.length - 1];
            const change = (Math.random() - 0.5) * (seed * 5);
            last.close += change;
            last.high = Math.max(last.high, last.close);
            last.low = Math.min(last.low, last.close);
        }

        return candles;
    }, [interval, tick]);

    const maxPrice = Math.max(...data.map(d => d.high));
    const minPrice = Math.min(...data.map(d => d.low));
    const range = maxPrice - minPrice || 1;

    return (
        <div className="flex flex-col w-full h-48 bg-[#131722] rounded-xl border border-slate-800 overflow-hidden relative shadow-inner font-mono">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1e222d] border-b border-slate-800 text-[10px] font-bold text-slate-400 z-10">
                <span className="text-emerald-400 mr-2 uppercase tracking-widest">BTC/USD</span>
                {['1M', '5M', '1H', '1D'].map(inv => (
                    <button 
                        key={inv}
                        onClick={() => setChartInterval(inv)}
                        className={`px-2 py-0.5 rounded transition-colors ${interval === inv ? 'bg-[#2962ff] text-white' : 'hover:bg-slate-700/50 hover:text-slate-300'}`}
                    >
                        {inv}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 flex items-end justify-between px-1 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-5">
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                </div>
                
                {data.map((candle, i) => {
                    const isUp = candle.close >= candle.open;
                    const color = isUp ? 'bg-[#089981]' : 'bg-[#f23645]';
                    
                    const topBody = Math.max(candle.open, candle.close);
                    const bottomBody = Math.min(candle.open, candle.close);
                    
                    const heightBodyPct = Math.max(0.5, ((topBody - bottomBody) / range) * 90);
                    const bottomBodyPct = ((bottomBody - minPrice) / range) * 90 + 5; // 5% padding
                    
                    const topWickPct = ((candle.high - minPrice) / range) * 90 + 5;
                    const bottomWickPct = ((candle.low - minPrice) / range) * 90 + 5;
                    
                    return (
                        <div key={i} className="flex flex-col items-center justify-end relative h-full group" style={{ width: `${100 / data.length}%` }}>
                            {/* Wick */}
                            <div className={`absolute w-[1px] ${color} opacity-80`} style={{
                                bottom: `${bottomWickPct}%`,
                                height: `${topWickPct - bottomWickPct}%`
                            }}></div>
                            {/* Body */}
                            <div className={`absolute w-[60%] sm:w-[70%] ${color} rounded-sm`} style={{
                                bottom: `${bottomBodyPct}%`,
                                height: `${heightBodyPct}%`
                            }}></div>
                        </div>
                    );
                })}
            </div>
            {/* Price line for last candle */}
            <div className="absolute right-0 flex items-center gap-1 z-10" style={{
                bottom: `${((data[data.length - 1].close - minPrice) / range) * 90 + 5}%`,
                transform: 'translateY(50%)'
            }}>
                <div className="w-4 border-t border-dashed border-[#2962ff]"></div>
                <div className="bg-[#2962ff] text-white text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold">
                    {data[data.length - 1].close.toFixed(1)}
                </div>
            </div>
        </div>
    );
};
