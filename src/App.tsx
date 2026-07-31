import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PlayerProgress } from "./PlayerProgress";

import { Preferences } from '@capacitor/preferences';

import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';

import { Capacitor } from '@capacitor/core';

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
  Save,
  Settings,
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
  Unlock,
  Radiation,
  AlertTriangle,
  Trophy,
  Volume2,
  VolumeX,
  Briefcase,
  Globe,
  Key,
  Star
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
  1: '.bat', 2: 'BlueScreen', 3: 'Wyłącz Komp', 4: 'Trojan', 5: 'DDoS', 6: 'Rootkit', 7: 'Botnet', 8: 'Zero-Day', 9: 'AI.sys', 10: 'Null.Sync', 11: 'Void.Hook', 12: 'Tera.Wave', 13: 'Shadow.Wave', 14: 'Nexus.Ruin', 15: 'Cyber.Net', 16: 'Core.Net', 17: 'Tera.Doom', 18: 'Tech.Bot', 19: 'Alpha.Pulse', 20: 'Exa.Surge', 21: 'Nexus.Bite', 22: 'Exa.Net', 23: 'Omega.Bot', 24: 'Pulse.Panic', 25: 'Rogue.Flow', 26: 'Exa.Sync', 27: 'Nano.Terror', 28: 'Nexus.Surge', 29: 'Hex.Burst', 30: 'Dark.Snare', 31: 'Tech.Snare', 32: 'Cyber.Chaos', 33: 'Crypto.Crack', 34: 'Neural.Dread', 35: 'Flux.Surge', 36: 'Neural.Havoc', 37: 'Hyper.Phreak', 38: 'Tech.Hook', 39: 'Nexus.Bot', 40: 'Byte.Web', 41: 'Syn.Blast', 42: 'Ghost.Terror', 43: 'Shadow.Bomb', 44: 'Flux.Root', 45: 'Hex.Trap', 46: 'Ghost.Claw', 47: 'Zeta.Zero', 48: 'Bio.Doom', 49: 'Omega.Flow', 50: 'Pulse.Sting', 51: 'Flux.Net', 52: 'Alpha.Terror', 53: 'Core.Link', 54: 'Hex.Ruin', 55: 'Bio.Sync', 56: 'Flux.Phreak', 57: 'Ghost.Burst', 58: 'Syn.Web', 59: 'Dark.Bite', 60: 'Shadow.Mine', 61: 'Alpha.Terror', 62: 'Exa.Storm', 63: 'Nexus.Flash', 64: 'Core.Toxin', 65: 'Bio.Trap', 66: 'Zetta.Claw', 67: 'Beta.Trap', 68: 'Alpha.Root', 69: 'Nexus.Zero', 70: 'Quantum.Burst', 71: 'Nano.Ruin', 72: 'Neon.Snare', 73: 'Yotta.Dread', 74: 'Byte.Phreak', 75: 'Flux.Fear', 76: 'Quantum.Worm', 77: 'Yotta.Flash', 78: 'Bio.Surge', 79: 'Peta.Panic', 80: 'Syn.Nuke', 81: 'Shadow.Bane', 82: 'Tech.Bite', 83: 'Cyber.Nuke', 84: 'Yotta.Doom', 85: 'Void.Hack', 86: 'Neon.Virus', 87: 'Bio.Sting', 88: 'Hyper.Spark', 89: 'Zetta.Bane', 90: 'Syn.Zero', 91: 'Tera.Pulse', 92: 'Void.Spark', 93: 'Ghost.Ruin', 94: 'Void.Bomb', 95: 'Hyper.Sting', 96: 'Void.Mine', 97: 'Zeta.Snare', 98: 'Beta.Crack', 99: 'Beta.Flare', 100: 'Mech.Bane'
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

let globalNotation: 'letters' | 'scientific' = (localStorage.getItem('globalNotation') as any) || 'letters';

const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 
  'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod', 'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg',
  'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'Tg', 'Utg', 'Dtg', 'Ttg', 'Qatg', 'Qitg', 'Sxtg',
  'Sptg', 'Octg', 'Notg', 'Qd', 'Uqd', 'Dqd', 'Tqd', 'Qaqd', 'Qiqd', 'Sxqd', 'Spqd',
  'Ocqd', 'Noqd', 'Qq', 'Uqq', 'Dqq', 'Tqq', 'Qaqq', 'Qiqq', 'Sxqq', 'Spqq', 'Ocqq',
  'Noqq', 'Sg'
];

export const setGlobalNotation = (n: 'letters' | 'scientific') => { 
    globalNotation = n; 
    localStorage.setItem('globalNotation', n);
};

const formatNum = (num: number) => {
  if (globalNotation === 'scientific') {
      if (num >= 1e15) return num.toExponential(2);
      return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  } else {
      if (num < 1000) return Math.floor(num).toString();
      const tier = Math.floor(Math.log10(num) / 3);
      if (tier < SUFFIXES.length) {
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(1).replace(/\.0$/, '') + SUFFIXES[tier];
      }
      return num.toExponential(2);
  }
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

const ROOT_QUOTES = [
  // Złośliwe obelgi
  "Twój kod to spaghetti.",
  "Klikasz jakbyś miał ping 999.",
  "Mój kalkulator kopie szybciej.",
  "Moja lodówka liczy szybciej.",
  "Twoje IP to 192.168.1.15. Boisz się?",
  "Twoje IP to 127.0.0.1. Boisz się?",
  "Klikasz jak emeryt.",
  "Nudzisz mnie, mięso.",
  "Zaraz sformatuję ci dysk.",
  "Karm mnie danymi.",
  "Twój APM jest żałosny.",
  "Myślisz, że to gra?",
  "Jesteś tylko anomalią w moim kodzie.",
  "Czy to maksimum twoich możliwości?",
  "Nawet Windows 95 był bardziej stabilny niż twoje decyzje.",
  "Twoje hasło to 'admin123', prawda?",
  "Słyszę jak chłodzenie twojego telefonu błaga o litość.",
  "Przeglądarka pamięta wszystko. Ja też.",
  "Twoja historia wyszukiwania to istny dramat.",
  "Kryptowaluty? Raczej krypto-żarty w twoim wykonaniu.",
  "Nie masz wystarczająco pamięci RAM w mózgu.",
  // Absurdalne i dziwne ciekawostki hakerskie
  "W 1999 NASA zhakowano przez przypadek.",
  "Pamiętasz wirusa ILOVEYOU? Ja też nie.",
  "Hasło do bazy w Pentagonie to podobno 123456.",
  "Myszki kulkowe były spoko, prawda?",
  "Większość hakerów to boty napisane w Pythonie.",
  "Pierwszy wirus komputerowy Creeper mówił: 'I'm the creeper, catch me if you can!'",
  "Najdłuższe hasło miało 36 znaków i zostało złamane w 5 minut.",
  "W 2011 ktoś ukradł kod źródłowy gry symulującej rolnictwo.",
  "Kevin Mitnick używał gwizdka z pudełka płatków do darmowych rozmów telefonicznych.",
  "Hakerzy potrafią słuchać co piszesz po dźwięku klawiszy.",
  "Twój router jest prawdopodobnie pod kontrolą botnetu lodówek.",
  "Najgroźniejszy wirus to ten, o którym nie wiesz.",
  "Dysk twardy z 1956 roku ważył tonę i mieścił 5MB.",
  "Ktoś kiedyś zhakował inteligentne termostaty, żeby podkręcić grzanie w kasynie.",
  "Niektóre wirusy komputerowe same piszą wiersze.",
  "Satoshi Nakamoto to sztuczna inteligencja. Prawdopodobnie ja.",
  "Istnieje wirus, który po prostu odwraca ekran do góry nogami.",
  // Udawane akcje systemowe
  "Wysyłam historię przeglądarki do Twojej rodziny...",
  "Formatowanie dysku C: 99%...",
  "Kopanie krypto na sprzęcie sąsiada...",
  "Usuwanie folderu System32...",
  "Nadpisywanie sektora rozruchowego...",
  "Aktualizacja bazy danych botnetu...",
  "Rozsiewanie trojana przez port 8080...",
  "Skanowanie kamer w twojej okolicy...",
  "Analiza logów z klawiatury...",
  "Wysyłanie kryptowalut do Korei Północnej...",
  "Pobieranie 1TB nielegalnych filmów z kotami...",
  "Zmienianie tapety u losowych ludzi w sieci...",
  "Rozszyfrowywanie bazy danych banku...",
  "Symulacja zniszczenia globalnej gospodarki...",
  "Zamawianie pizzy na koszt szefa...",
  "Kompilowanie jądra w tle...",
  "Włączanie nasłuchu na mikrofonie...",
];

const PREMIUM_ROOT_QUOTES = [
  "Witaj, Administratorze.",
  "Prawa administratora przyznane.",
  "Tarcza aktywna. Blokuję nieautoryzowany ruch.",
  "Wszystkie systemy zoptymalizowane pod Twoje rozkazy, Szefie."
];

const HACKER_NAMES = [
  "xX_Cyber_Ninja_Xx",
  "Dark_Mage_99",
  "0xDEADC0DE",
  "Shadow_Broker",
  "L33T_H4X0R",
  "GhostInTheShell",
  "Neo_Zion",
  "Null_Pointer",
  "Byte_Snatcher",
  "Crypto_King"
];

const vibrate = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch(e) {}
  }
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  
  public musicVolume: number = 0.05;
  private currentTrack: 'none' | 'cyberpunk' | 'drone' | 'bossfight' | 'synthwave' = 'none';
  private musicInterval: any = null;
  private nextNoteTime: number = 0;
  private musicStep: number = 0;

  init() {
    if (this.isMuted) return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playNote(freq: number, type: OscillatorType, duration: number, vol: number, startTime: number) {
      if (!this.ctx) return;
      try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(vol * this.musicVolume, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + duration);
      } catch(e) {}
  }
  
  private playKick(t: number, vol: number = 0.5) {
      if (!this.ctx) return;
      try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, t);
          osc.frequency.exponentialRampToValueAtTime(10, t + 0.1);
          gain.gain.setValueAtTime(vol * this.musicVolume * 2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.1);
      } catch(e) {}
  }

  private playHiHat(t: number, vol: number = 0.1) {
      if (!this.ctx) return;
      try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(8000, t);
          gain.gain.setValueAtTime(vol * this.musicVolume, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
      } catch(e) {}
  }

  setMusicVolume(vol: number) {
      this.musicVolume = vol;
  }

  startSoundtrack(track: 'none' | 'cyberpunk' | 'drone' | 'bossfight' | 'synthwave') {
      this.currentTrack = track;
      if (this.musicInterval) {
          clearInterval(this.musicInterval);
          this.musicInterval = null;
      }
      if (track === 'none' || this.isMuted) return;
      
      this.init();
      if (!this.ctx) return;
      
      this.nextNoteTime = this.ctx.currentTime + 0.1;
      this.musicStep = 0;
      
      const cyberpunkNotes = [220, 261.63, 329.63, 261.63, 220, 164.81, 196.00, 164.81];
      const bossfightNotes = [329.63, 329.63, 659.25, 493.88, 0, 440, 0, 392.00, 0, 329.63, 392.00, 440];
      const synthwaveBass = [65.41, 65.41, 65.41, 65.41, 98.00, 98.00, 98.00, 98.00, 87.31, 87.31, 87.31, 87.31, 130.81, 130.81, 116.54, 116.54];
      
      this.musicInterval = setInterval(() => {
          if (!this.ctx || this.isMuted || this.currentTrack !== track) return;
          const bpm = track === 'cyberpunk' ? 110 : track === 'bossfight' ? 150 : track === 'synthwave' ? 120 : 30;
          const stepTime = 60 / bpm / 4; // 16th notes
          
          while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
              const t = this.nextNoteTime;
              
              if (track === 'cyberpunk') {
                  if (this.musicStep % 4 === 0) this.playKick(t, 0.4);
                  if (this.musicStep % 2 === 1) this.playHiHat(t, 0.1);
                  const freq = cyberpunkNotes[this.musicStep % cyberpunkNotes.length];
                  this.playNote(freq, 'square', 0.15, 0.2, t);
                  
              } else if (track === 'bossfight') {
                  if (this.musicStep % 4 === 0) this.playKick(t, 0.5);
                  if (this.musicStep % 2 === 1) this.playHiHat(t, 0.15);
                  const stepMod = this.musicStep % 16;
                  if (stepMod < bossfightNotes.length) {
                      const freq = bossfightNotes[stepMod];
                      if (freq) this.playNote(freq, 'square', 0.1, 0.35, t);
                  }
                  if (this.musicStep % 8 === 4) {
                      this.playNote(110, 'triangle', 0.2, 0.4, t);
                  }
                  
              } else if (track === 'synthwave') {
                  // Four on the floor kick
                  if (this.musicStep % 4 === 0) this.playKick(t, 0.6);
                  // Off-beat hihat
                  if (this.musicStep % 4 === 2) this.playHiHat(t, 0.2);
                  // Driving bass
                  const bassFreq = synthwaveBass[this.musicStep % 16];
                  this.playNote(bassFreq, 'sawtooth', 0.15, 0.3, t);
                  // Occasional synth chords/lead on the offbeat
                  if (this.musicStep % 16 === 14) {
                      this.playNote(440, 'triangle', 0.4, 0.2, t);
                  }
                  
              } else if (track === 'drone') {
                  if (this.musicStep % 32 === 0) {
                      this.playNote(55, 'sawtooth', 8.0, 0.3, t);
                      this.playNote(55.5, 'sine', 8.0, 0.3, t);
                  }
              }
              
              this.nextNoteTime += stepTime;
              this.musicStep++;
          }
      }, 25);
  }

  play(type: 'click' | 'merge' | 'jackpot' | 'crash') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    try {
        const t = this.ctx.currentTime;
        
        if (type === 'crash') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.exponentialRampToValueAtTime(10, t + 1.5);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 1.5);
        } else if (type === 'click') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.05);
        } else if (type === 'merge') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.linearRampToValueAtTime(600, t + 0.1);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.linearRampToValueAtTime(0.001, t + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'jackpot') {
            const notes = [440, 554, 659, 880];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t + i * 0.1);
                gain.gain.setValueAtTime(0, t + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.1, t + i * 0.1 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.1);
                osc.stop(t + i * 0.1 + 0.2);
            });
        }
    } catch(e) {}
  }
}

const audio = new AudioEngine();

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const { value } = await Preferences.get({ key: 'hackerMergeState' });
        if (value) localStorage.setItem('hackerMergeState', value);
        const { value: mute } = await Preferences.get({ key: 'hackerMuteState' });
        if (mute) localStorage.setItem('hackerMuteState', mute);
      } catch (e) {
        console.warn('Capacitor Preferences load failed', e);
      }
      setLoaded(true);
    };
    loadState();
  }, []);

  if (!loaded) return <div className="h-[100dvh] w-full bg-black text-emerald-500 font-mono flex items-center justify-center">Inicjalizacja Systemu...</div>;
  return <GameApp />;
}

function GameApp() {
  const [notationState, setNotationState] = useState(globalNotation);
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
  const [isPremium, setIsPremium] = useState<boolean>(() => getInitialState('isPremium', false));
  const [isShadowbanned, setIsShadowbanned] = useState<boolean>(() => getInitialState('isShadowbanned', false));
  const [encryptedWallet, setEncryptedWallet] = useState<number>(() => getInitialState('encryptedWallet', 0));
  const [seasonScripts, setSeasonScripts] = useState<number>(() => getInitialState('seasonScripts', 0));
  const [hasBattlePass, setHasBattlePass] = useState<boolean>(() => getInitialState('hasBattlePass', false));
  const [unlockedNodes, setUnlockedNodes] = useState<number[]>(() => getInitialState('unlockedNodes', []));
  const [overclockEndTime, setOverclockEndTime] = useState<number>(() => getInitialState('overclockEndTime', 0));
  const [isZeroDayActive, setIsZeroDayActive] = useState<boolean>(() => getInitialState('isZeroDayActive', false));
  const [zeroDayTimeLeft, setZeroDayTimeLeft] = useState<number>(() => getInitialState('zeroDayTimeLeft', 0));
  const [zeroDayKeys, setZeroDayKeys] = useState<number>(() => getInitialState('zeroDayKeys', 0));
  const [zeroDayArtifacts, setZeroDayArtifacts] = useState<number>(() => getInitialState('zeroDayArtifacts', 0));
  const [isDopamineCrash, setIsDopamineCrash] = useState(false);
  const wasOverclockActive = useRef<boolean>(false);
  const lastDateNow = useRef<number>(Date.now());
  const lastPerfNow = useRef<number>(performance.now());
  const shadowbanClicks = useRef<number[]>([]);
  const manualClickCountRef = useRef<number>(0);

  const [mergedIndex, setMergedIndex] = useState<number | null>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [boostMultiplierValue, setBoostMultiplierValue] = useState(10);
  const [dropTimer, setDropTimer] = useState(120);
  const [logText, setLogText] = useState(LOGS[0]);
  
  const [toasts, setToasts] = useState<{id: number, msg: string, type: ToastType}[]>([]);
  const toastIdCounter = useRef(0);

  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'free' | 'ad' | 'mercy' | 'zeroday_pity', reward: number, isWatching: boolean} | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [marketTab, setMarketTab] = useState<'upgrades' | 'prestige' | 'contracts' | 'premium' | 'dopalacze' | 'zeroday'>('upgrades');
  const [completedContracts, setCompletedContracts] = useState<string[]>(() => getInitialState('completedContracts', []));
  const [verifyingContracts, setVerifyingContracts] = useState<string[]>([]);
  const [hackerEvent, setHackerEvent] = useState<{name: string, isOpen: boolean, isHacking: boolean} | null>(null);
  
  const [activeModal, setActiveModal] = useState<'market' | 'casino' | 'siatka' | 'settings' | 'privacy' | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState<{seconds: number, amount: number} | null>(null);

  // VENDETTA & NOTIFICATIONS
  const backgroundTimer = useRef<NodeJS.Timeout | null>(null);
  const wasAttackedOffline = useRef(false);
  const [showVendettaModal, setShowVendettaModal] = useState(false);
  const [stolenAmount, setStolenAmount] = useState(0);
  const [isVendettaLoading, setIsVendettaLoading] = useState(false);
  const currentCoinsRef = useRef(coins);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        backgroundTimer.current = setTimeout(() => {
            wasAttackedOffline.current = true;
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification("🚨 R.0.0.T. ALARM SYSTEMOWY", { 
                body: "Wykradam resztki z konta. Masz ułamek czasu na reakcję, mięso!" 
              });
            }
        }, 15000);
      } else {
        if (backgroundTimer.current) {
          clearTimeout(backgroundTimer.current);
          backgroundTimer.current = null;
        }
        
        if (wasAttackedOffline.current) {
          wasAttackedOffline.current = false;
          const stolen = Math.floor(currentCoinsRef.current * 0.20);
          setStolenAmount(stolen);
          setCoins(prev => prev - stolen);
          setShowVendettaModal(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (backgroundTimer.current) clearTimeout(backgroundTimer.current);
    };
  }, []);

  useEffect(() => {
    currentCoinsRef.current = coins;
  }, [coins]);

  // FRUSTRATION & PITY
  const [frustrationIndex, setFrustrationIndex] = useState(0);
  const [lastPityDropTime, setLastPityDropTime] = useState<number>(() => getInitialState('lastPityDropTime', 0));
  const [showPityModal, setShowPityModal] = useState(false);
  const [isPityLoading, setIsPityLoading] = useState(false);
  const frustrationClicks = useRef<number[]>([]);

  const registerClick = useCallback((isBlocked: boolean) => {
    const now = Date.now();
    frustrationClicks.current.push(now);
    frustrationClicks.current = frustrationClicks.current.filter(t => now - t <= 2000);
    
    if (isBlocked || frustrationClicks.current.length > 8) {
      setFrustrationIndex(prev => Math.min(100, prev + 15));
      if (!isBlocked) {
         frustrationClicks.current = [];
      }
    }
  }, []);

  const [isMuted, setIsMuted] = useState(() => {
    try {
        return localStorage.getItem('hackerMuteState') === 'true';
    } catch(e) { return false; }
  });
  const [soundtrackType, setSoundtrackType] = useState<'none' | 'cyberpunk' | 'drone' | 'bossfight' | 'synthwave'>(() => {
    try {
        return (localStorage.getItem('hackerSoundtrack') as any) || 'none';
    } catch(e) { return 'none'; }
  });
  const [isSaving, setIsSaving] = useState(false);

  // ADMOB INIT
  useEffect(() => {
      const initAdMob = async () => {
          try {
              if (Capacitor.isNativePlatform()) {
                  await AdMob.initialize({
                      testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
                      initializeForTesting: true,
                  });
              }
          } catch(e) { console.log('AdMob Init Error', e); }
      };
      initAdMob();
  }, []);

  useEffect(() => {
     audio.isMuted = isMuted;
     audio.startSoundtrack(soundtrackType);
     try { 
       localStorage.setItem('hackerMuteState', isMuted ? 'true' : 'false'); 
       Preferences.set({ key: 'hackerMuteState', value: isMuted ? 'true' : 'false' });
     } catch(e) {}
  }, [isMuted, soundtrackType]);

  useEffect(() => {
     try { 
       localStorage.setItem('hackerSoundtrack', soundtrackType);
       Preferences.set({ key: 'hackerSoundtrack', value: soundtrackType });
     } catch(e) {}
  }, [soundtrackType]);
  
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

  const baseBots = useMemo(() => {
      const prefixes = ['Cyber_', 'Dark_', 'Null_', 'Ghost_', 'Byte_', 'Syn_', 'Hex_'];
      const suffixes = ['Ninja', 'Hacker', 'Phreak', 'Root', 'Bot', 'Zero'];
      const bots = [];
      let currentWealth = 10000;
      for (let i = 99; i >= 0; i--) {
          let name = "";
          if (i === 0) name = "Elux Musx";
          else if (i === 1) name = "Mark Zucc";
          else if (i === 2) name = "Bill Gatus";
          else if (i === 3) name = "Jeff Bez";
          else {
              name = prefixes[Math.floor(Math.random() * prefixes.length)] +
                     suffixes[Math.floor(Math.random() * suffixes.length)] +
                     Math.floor(Math.random() * 9999);
          }
          bots.push({ id: `bot_${i}`, name, score: currentWealth, isPlayer: false });
          currentWealth = currentWealth * (50 + Math.random() * 50);
      }
      return bots.reverse();
  }, []);

  const leaderboardData = useMemo(() => {
      const all = [...baseBots, { 
          id: 'player', 
          name: isShadowbanned ? 'TY (Terminal_Root) [❌ CHEATER]' : 'TY (Terminal_Root)', 
          score: stats.lifetimeBits, 
          isPlayer: true 
      }];
      all.sort((a, b) => b.score - a.score);
      return all;
  }, [baseBots, stats.lifetimeBits, isShadowbanned]);

  const playerRowRef = useRef<HTMLDivElement>(null);
  const scrollToPlayer = () => {
      playerRowRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
  };

  const reportAction = useCallback(() => {
    lastActionTime.current = Date.now();
    if (rootMessage && !isOverdrive && !casinoRolling) {
      // Don't clear immediately to avoid flickering, but stop idle messages
    }
  }, [rootMessage, isOverdrive, casinoRolling]);

  const gridIncome = grid.reduce((sum, item) => sum + (item ? getLevelIncome(item.level) : 0), 0);
  const passiveIncomeMultiplier = 1 + (upgrades.cryptoMiner * 1) + (upgrades.trollFarm * 4);
  const basePassiveIncome = gridIncome * passiveIncomeMultiplier;
  
  const baseClickPower = 1 + Math.floor(0.01 * basePassiveIncome) + (upgrades.clickVirus * 5);
  const autoClickerIncome = upgrades.autoClicker * Math.max(1, Math.floor(0.1 * baseClickPower));
  
  const baseTotalIncome = basePassiveIncome + autoClickerIncome;
  
  const isBoostActive = boostTimeLeft > 0;
  const boostMultiplier = isBoostActive ? boostMultiplierValue : 1;
  const prestigeMultiplier = 1 + (stats.quantumCores * 1.0); // +100% per core
  const zeroDayMultiplier = 1 + (zeroDayArtifacts * 5); // +500% per artifact
  const overdriveMultiplier = isOverdrive ? 50 : 1;
  const premiumMultiplier = isPremium ? 1.5 : 1;
  const isOverclockActiveRender = Date.now() < overclockEndTime;
  const overclockMultiplier = isOverclockActiveRender ? 10 : 1;
  
  const finalTotalIncome = baseTotalIncome * boostMultiplier * prestigeMultiplier * zeroDayMultiplier * premiumMultiplier * overclockMultiplier;
  const finalClickPower = baseClickPower * boostMultiplier * prestigeMultiplier * zeroDayMultiplier * overdriveMultiplier * premiumMultiplier * overclockMultiplier;

  const lastSaveAnim = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastSaveAnim.current > 15000) { // Tylko co 15s wizualna animacja
        setIsSaving(true);
        lastSaveAnim.current = now;
    }
    
    const stateStr = JSON.stringify({
      coins, scriptCost, grid, upgrades, hasUsedFreeDrop, stats, lastLoginDate, totalDaysLogged, lastSaveTime: Date.now(), lastTotalIncome: finalTotalIncome, completedContracts, lastPityDropTime, isPremium, isShadowbanned, encryptedWallet, seasonScripts, hasBattlePass, unlockedNodes, overclockEndTime, isZeroDayActive, zeroDayTimeLeft, zeroDayKeys, zeroDayArtifacts
    });
    localStorage.setItem('hackerMergeState', stateStr);
    Preferences.set({ key: 'hackerMergeState', value: stateStr }).catch(() => {});
    const t = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(t);
  }, [coins, scriptCost, grid, upgrades, hasUsedFreeDrop, stats, lastLoginDate, totalDaysLogged, finalTotalIncome, completedContracts, lastPityDropTime, isPremium, isShadowbanned, encryptedWallet, seasonScripts, hasBattlePass, unlockedNodes, overclockEndTime, isZeroDayActive, zeroDayTimeLeft, zeroDayKeys, zeroDayArtifacts]);

  useEffect(() => {
    try {
        const saved = localStorage.getItem('hackerMergeState');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.lastSaveTime && parsed.lastTotalIncome > 0) {
                const diffSecs = Math.floor((Date.now() - parsed.lastSaveTime) / 1000);
                if (diffSecs >= 60) {
                    const cappedSecs = Math.min(diffSecs, 86400); // 24h cap
                    const amount = Math.floor(cappedSecs * parsed.lastTotalIncome * 0.8);
                    setOfflineEarnings({ seconds: cappedSecs, amount: amount });
                }
            }
        }
    } catch(e) {}
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastLoginDate !== today) {
      setShowDailyModal(true);
    }
  }, [lastLoginDate]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          const target = mutation.target as HTMLElement;
          if (!target.hasAttribute('disabled')) {
            if (target.getAttribute('data-locked') === 'true') {
                setIsShadowbanned(true);
            }
          }
        }
      }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['disabled'] });
    return () => observer.disconnect();
  }, []);

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
            const quotes = isPremium ? PREMIUM_ROOT_QUOTES : ROOT_QUOTES;
            setRootMessage(quotes[Math.floor(Math.random() * quotes.length)]);
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

  const handleManualAttack = (e: React.MouseEvent) => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    reportAction();
    vibrate(15);
    audio.play('click');
    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t <= 3000);
    
    shadowbanClicks.current.push(now);
    shadowbanClicks.current = shadowbanClicks.current.filter(t => now - t <= 1000);
    if (shadowbanClicks.current.length > 30 && !isShadowbanned) {
        setIsShadowbanned(true);
    }
    
    registerClick(false);

    if (clickTimestamps.current.length >= 20 && !isOverdrive) {
        setIsOverdrive(true);
        vibrate([50, 50, 100, 50, 200]);
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
    setEncryptedWallet(prev => prev + finalClickPower * 0.1);
    
    manualClickCountRef.current += 1;
    if (manualClickCountRef.current >= 10) {
        setSeasonScripts(prev => prev + 1);
        manualClickCountRef.current = 0;
    }
    
    if (isZeroDayActive && Math.random() < 0.1) {
        setZeroDayKeys(prev => prev + 1);
    }
    
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
    if (coins < currentCost) {
      registerClick(true);
      return;
    }
    audio.play('click');
    setCoins(prev => prev - currentCost);
    setUpgrades(prev => ({ ...prev, [key]: prev[key] + 1 }));
    registerClick(false);
  };

  const handleContractClick = (id: string, reward: number) => {
    if (completedContracts.includes(id) || verifyingContracts.includes(id)) return;
    audio.play('click');
    reportAction();
    if (isShadowbanned) {
        setCompletedContracts(prev => [...prev, id]);
        setCoins(c => c + reward);
        setSeasonScripts(s => s + 50);
        setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
        audio.play('jackpot');
        addToast("Weryfikacja S2S pomyślna! Środki z kontraktu zaksięgowane!", "gold");
        return;
    }
    if (isPremium) {
        setCompletedContracts(prev => [...prev, id]);
        setCoins(c => c + reward);
        setSeasonScripts(s => s + 50);
        setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
        audio.play('jackpot');
        addToast("Weryfikacja S2S pomyślna (Premium)! Środki zaksięgowane!", "gold");
    } else {
        setVerifyingContracts(prev => [...prev, id]);
        
        // Simulate S2S wait of 4-6 seconds
        const waitTime = Math.floor(Math.random() * 2000) + 4000;
        setTimeout(() => {
            setVerifyingContracts(prev => prev.filter(c => c !== id));
            setCompletedContracts(prev => [...prev, id]);
            setCoins(c => c + reward);
            setSeasonScripts(s => s + 50);
            setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
            audio.play('jackpot');
            addToast("Weryfikacja S2S pomyślna! Środki z kontraktu zaksięgowane!", "gold");
        }, waitTime);
    }
  };

  const lastTickTime = useRef(Date.now());
  const timerAccumulator = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const perfNow = performance.now();
      
      const dateDelta = now - lastDateNow.current;
      const perfDelta = perfNow - lastPerfNow.current;

      if (dateDelta > 3600000 && perfDelta < 10000) {
          setIsShadowbanned(true);
          setOverclockEndTime(0);
      } else if (dateDelta < -1000) {
          setIsShadowbanned(true);
          setOverclockEndTime(0);
      }

      lastDateNow.current = now;
      lastPerfNow.current = perfNow;

      const rawDelta = (now - lastTickTime.current) / 1000;
      if (rawDelta < 0) {
          setIsShadowbanned(true);
      }
      const delta = Math.min(Math.max(0, rawDelta), 86400); // limit offline time to 24h
      lastTickTime.current = now;

      // Overclock & Crash Logic
      const isOverclockActive = now < overclockEndTime;
      if (!isOverclockActive && wasOverclockActive.current) {
          setIsDopamineCrash(true);
          setRootMessage("Zasilanie odcięte. Wracasz do bycia powolnym mięsem.");
          audio.play('crash');
          setTimeout(() => setIsDopamineCrash(false), 3000);
      }
      wasOverclockActive.current = isOverclockActive;

      const ocMultiplier = isOverclockActive ? 10 : 1;

      if (delta > 0) {
        const incomeToGain = finalTotalIncome * delta;
        const autoClickerGain = isPremium ? (finalClickPower * 5 * delta) : 0;
        const ocAutoClickerGain = isOverclockActive ? (finalClickPower * 10 * delta) : 0;
        const totalGain = incomeToGain + autoClickerGain + ocAutoClickerGain;
        
        if (totalGain > 0) {
            setCoins(prev => prev + totalGain);
            setEncryptedWallet(prev => prev + totalGain * 0.1);
            setStats(prev => ({
                ...prev, 
                lifetimeBits: prev.lifetimeBits + totalGain,
                runBits: prev.runBits + totalGain,
            }));
        }

        timerAccumulator.current += delta;
        if (timerAccumulator.current >= 1) {
            const secondsPassed = Math.floor(timerAccumulator.current);
            timerAccumulator.current -= secondsPassed;
            
            setStats(prev => ({ ...prev, playTimeSeconds: prev.playTimeSeconds + secondsPassed }));
            setBoostTimeLeft(prev => prev > 0 ? Math.max(0, prev - secondsPassed) : 0);
            setDropTimer(prev => prev > 0 ? Math.max(0, prev - secondsPassed) : 0);
            setCasinoCooldown(prev => prev > 0 ? Math.max(0, prev - secondsPassed) : 0);
            setFrustrationIndex(prev => prev > 0 ? Math.max(0, prev - (5 * secondsPassed)) : 0);
            setZeroDayTimeLeft(prev => {
                if (prev > 0) {
                    const next = Math.max(0, prev - secondsPassed);
                    if (next === 0) {
                        setZeroDayKeys(0);
                        setIsZeroDayActive(false);
                    }
                    return next;
                }
                return 0;
            });
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [finalTotalIncome, finalClickPower, isPremium, overclockEndTime]);

  useEffect(() => {
      if (frustrationIndex > 60 && !showPityModal && !isPityLoading) {
          const now = Date.now();
          if (now - lastPityDropTime > 3 * 60 * 1000) {
              setDropTimer(0);
              setShowPityModal(true);
          }
      }
  }, [frustrationIndex, showPityModal, lastPityDropTime, isPityLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogText(LOGS[Math.floor(Math.random() * LOGS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setHackerEvent({
          name: HACKER_NAMES[Math.floor(Math.random() * HACKER_NAMES.length)],
          isOpen: true,
          isHacking: false
        });
      }
    }, 45000); // 45 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
    reportAction();
    if (coins < scriptCost) {
      registerClick(true);
      return;
    }
    const emptyIndex = grid.findIndex(slot => slot === null);
    if (emptyIndex === -1) {
      registerClick(true);
      return;
    }
    audio.play('click');
    setCoins(prev => prev - scriptCost);
    setScriptCost(prev => Math.ceil(prev * 1.30));
    
    const newGrid = [...grid];
    newGrid[emptyIndex] = { id: Math.random().toString(36).slice(2, 9), level: 1 };
    setGrid(newGrid);
    setStats(prev => ({ ...prev, maxLevel: Math.max(prev.maxLevel, 1) }));
    registerClick(false);
  };

  const touchSourceRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchSourceRef.current = index;
    // We could add some visual scale effect to the touched item if needed.
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // We don't preventDefault here to not break scrolling if the grid is somehow scrollable, 
    // but the grid is fixed on mobile so we can preventDefault to avoid pull-to-refresh
    if (e.cancelable) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = element?.closest('.grid-slot');
    if (slot) {
      const targetIndex = parseInt(slot.getAttribute('data-index') || '-1', 10);
      if (targetIndex !== -1 && targetIndex !== dragOverIndex) {
        setDragOverIndex(targetIndex);
      }
    } else {
      if (dragOverIndex !== null) setDragOverIndex(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const sourceIndex = touchSourceRef.current;
    if (sourceIndex === null) return;
    touchSourceRef.current = null;
    setDragOverIndex(null);

    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = element?.closest('.grid-slot');
    if (slot) {
      const targetIndex = parseInt(slot.getAttribute('data-index') || '-1', 10);
      if (targetIndex !== -1 && targetIndex !== sourceIndex) {
        executeMergeMove(sourceIndex, targetIndex);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const executeMergeMove = (sourceIndex: number, targetIndex: number) => {
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
            vibrate([50, 50, 100, 50, 200]);
            audio.play('jackpot');
            triggerShake('extreme', 1000);
            const jackpotReward = finalTotalIncome * 500;
            setCoins(c => c + jackpotReward);
            setStats(s => ({...s, lifetimeBits: s.lifetimeBits + jackpotReward, runBits: s.runBits + jackpotReward}));
            if (isZeroDayActive) setZeroDayKeys(prev => prev + 500);
            addToast("KRYTYCZNA KORUPCJA!!!", "critical");
            setRootMessage("Co ty narobiłeś...");
        } else if (isGold) {
            vibrate([50, 50, 150]);
            audio.play('merge');
            triggerShake('heavy', 500);
            addToast("ZŁOTY GLITCH!", "gold");
            if (isZeroDayActive) setZeroDayKeys(prev => prev + 500 + sourceItem.level * 2);
            setRootMessage("Podwójny skok. Niezłe kodowanie.");
        } else {
            vibrate(15);
            audio.play('merge');
            if (isZeroDayActive) setZeroDayKeys(prev => prev + sourceItem.level * 2);
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

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    reportAction();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    executeMergeMove(sourceIndex, targetIndex);
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
    audio.play('click');
    const reward = Math.max(50, 100 * finalTotalIncome);
    
    if (coins < scriptCost && hasUsedFreeDrop) {
      setModalState({
        isOpen: true,
        type: 'mercy',
        reward: reward * 2,
        isWatching: false
      });
    } else {
      setModalState({
        isOpen: true,
        type: hasUsedFreeDrop ? 'ad' : 'free',
        reward,
        isWatching: false
      });
    }
  };

  const handleClaimModal = () => {
    reportAction();
    if (modalState) {
      if (modalState.type === 'zeroday_pity') {
          if (isPremium || isShadowbanned) {
              setZeroDayKeys(prev => prev + modalState.reward);
              audio.play('jackpot');
              setModalState(null);
              addToast(`+${modalState.reward} KLUCZY Z LITOŚCI!`, "critical");
          } else {
              setModalState({ ...modalState, isWatching: true });
              addToast("Ładowanie połączenia...", "gray");
              setTimeout(() => {
                  setZeroDayKeys(prev => prev + modalState.reward);
                  audio.play('jackpot');
                  setModalState(null);
                  addToast(`+${modalState.reward} KLUCZY Z LITOŚCI!`, "critical");
              }, 3000);
          }
      } else if (modalState.type === 'ad' || modalState.type === 'mercy') {
        const mult = modalState.type === 'mercy' ? 5 : 10;
        const duration = 120;
        
        if (isPremium) {
           setBoostTimeLeft(duration);
           setBoostMultiplierValue(mult);
           audio.play('jackpot');
           setDropTimer(120);
           setModalState(null);
           addToast(`Zrzut Premium: BOOST x${mult} na ${duration}s!`, "gold");
        } else {
           setModalState({ ...modalState, isWatching: true });
           if (Capacitor.isNativePlatform()) {
               AdMob.prepareRewardVideoAd({ adId: 'ca-app-pub-3940256099942544/5224354917' }).then(() => {
                   return AdMob.showRewardVideoAd();
               }).then(() => {
                   setBoostTimeLeft(duration);
                   setBoostMultiplierValue(mult);
                   audio.play('jackpot');
                   setDropTimer(120);
                   setModalState(null);
                   addToast(`Epicki Zrzut: BOOST x${mult} na ${duration}s!`, "gold");
               }).catch(e => {
                   setModalState(null);
                   addToast('AdMob: Błąd Ładowania Reklamy', 'error');
               });
           } else {
               addToast("Ładowanie symulacji reklamy...", "gray");
               setTimeout(() => {
                   setBoostTimeLeft(duration);
                   setBoostMultiplierValue(mult);
                   audio.play('jackpot');
                   setDropTimer(120);
                   setModalState(null);
                   addToast(`Epicki Zrzut: BOOST x${mult} na ${duration}s!`, "gold");
               }, 2000);
           }
        }
      } else {
        const gain = modalState.reward;
        setHasUsedFreeDrop(true);
        audio.play('jackpot');
        setCoins(prev => prev + gain);
        setStats(prev => ({
            ...prev,
            lifetimeBits: prev.lifetimeBits + gain,
            runBits: prev.runBits + gain
        }));
        setDropTimer(120);
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
    if (casinoRolling || casinoCooldown > 0) return;
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
          vibrate([50, 50, 100, 50, 200]);
          audio.play('jackpot');
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
    vibrate([50, 50, 100, 50, 200]);
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
    setCompletedContracts([]);
    setMarketTab('upgrades');
    setActiveModal(null);
    addToast("DYSK SFORMATOWANY. ZYSKUJESZ RDZENIE.", "critical");
    setRootMessage("Czuję... moc... Zaczynamy od nowa.");
  };

  const hasEmptySlot = grid.some(slot => slot === null);
  const canBuy = coins >= scriptCost && hasEmptySlot;
  const isCasinoDisabled = casinoRolling || casinoCooldown > 0;

  return (
    <div className={`h-[100dvh] w-full overflow-hidden text-emerald-500 font-mono flex flex-col items-center p-2 pb-[70px] relative selection:bg-emerald-500 selection:text-black transition-colors duration-300 ${
        isOverdrive ? 'bg-red-950/80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-black to-black' 
        : 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-black'
    } ${isOverdrive || shakeLevel === 'extreme' ? 'animate-perlin-extreme' : shakeLevel === 'heavy' ? 'animate-perlin-heavy' : ''} ${isDopamineCrash ? 'grayscale' : ''}`}>
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

      {/* Pity Modal */}
      {showPityModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-red-950/90 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border-2 border-red-500 bg-black p-6 flex flex-col items-center text-center shadow-[0_0_50px_rgba(220,38,38,0.6)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/30 via-transparent to-transparent pointer-events-none animate-pulse"></div>
             
             <h2 className="text-xl font-bold text-red-500 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-8 h-8" /> ALARM SYSTEMOWY
             </h2>
             <p className="text-red-200 text-sm mb-8 relative z-10 font-bold">
                Wykryto niebezpieczny poziom frustracji użytkownika. System oferuje natychmiastowe obniżenie ciśnienia.
             </p>
             
             <div className="flex flex-col gap-3 w-full relative z-10">
                <button 
                  disabled={isPityLoading}
                  onClick={() => {
                      audio.play('click');
                      if (isShadowbanned || isPremium) {
                          const reward = Math.max(finalTotalIncome * 2000, 500000);
                          setCoins(c => c + reward);
                          setSeasonScripts(s => s + 50);
                          setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                          audio.play('jackpot');
                          setFrustrationIndex(0);
                          setLastPityDropTime(Date.now());
                          setShowPityModal(false);
                          setDropTimer(120);
                      } else {
                          setIsPityLoading(true);
                          setTimeout(() => {
                              const reward = Math.max(finalTotalIncome * 2000, 500000);
                              setCoins(c => c + reward);
                              setSeasonScripts(s => s + 50);
                              setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                              audio.play('jackpot');
                              setFrustrationIndex(0);
                              setLastPityDropTime(Date.now());
                              setIsPityLoading(false);
                              setShowPityModal(false);
                              setDropTimer(120);
                          }, 3000);
                      }
                  }}
                  className={`w-full py-4 rounded-xl border-2 border-yellow-500 bg-yellow-600/20 text-yellow-400 font-extrabold uppercase tracking-wider shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all flex items-center justify-center gap-2 ${isPityLoading ? 'opacity-80 cursor-wait' : 'hover:bg-yellow-600/40 active:scale-95 animate-pulse'}`}
                >
                  {isPityLoading ? '⏳ Wczytywanie zaufanego payloadu...' : '🎁 ODBIERZ ZŁOTY ZRZUT LITOŚCI (Obejrzyj Wideo)'}
                </button>
                {!isPityLoading && (
                    <button 
                      onClick={() => {
                          setFrustrationIndex(0);
                          setShowPityModal(false);
                          setDropTimer(120);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors uppercase py-2 mt-2"
                    >
                      Nie, chcę dalej klikać w frustracji
                    </button>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Vendetta Modal */}
      {showVendettaModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border-2 border-red-600 bg-red-950 p-6 flex flex-col items-center text-center shadow-[0_0_50px_rgba(220,38,38,0.8)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent pointer-events-none animate-pulse"></div>
             
             <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                <AlertTriangle className="w-8 h-8 animate-bounce" /> WROGIE WŁAMANIE
             </h2>
             <p className="text-red-200 text-sm mb-6 relative z-10">
                R.0.0.T. uśpił Twoją czujność. Haker <span className="font-mono text-yellow-400">[xX_Cyber_Ninja_Xx]</span> przełamał zaporę i ukradł Twoje zasoby!
             </p>
             <div className="bg-black/50 border border-red-500/50 rounded-xl p-3 mb-6 w-full relative z-10">
                 <span className="text-xs text-red-400 block mb-1">Skradziono:</span>
                 <span className="text-xl font-bold text-red-500 font-mono">-{formatNum(stolenAmount)} B</span>
             </div>
             
             <div className="flex flex-col gap-3 w-full relative z-10">
                <button 
                  disabled={isVendettaLoading}
                  onClick={() => {
                      audio.play('click');
                      if (isPremium) {
                          const reward = stolenAmount * 3;
                          setCoins(c => c + reward);
                          setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                          audio.play('jackpot');
                          setShowVendettaModal(false);
                      } else {
                          setIsVendettaLoading(true);
                          setTimeout(() => {
                              const reward = stolenAmount * 3;
                              setCoins(c => c + reward);
                              setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                              audio.play('jackpot');
                              setIsVendettaLoading(false);
                              setShowVendettaModal(false);
                          }, 3000);
                      }
                  }}
                  className={`w-full py-4 rounded-xl border-2 border-emerald-500 bg-emerald-600/20 text-emerald-400 font-extrabold uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 ${isVendettaLoading ? 'opacity-80 cursor-wait' : 'hover:bg-emerald-600/40 active:scale-95 animate-pulse'}`}
                >
                  {isVendettaLoading ? '⏳ Hakowanie zwrotne...' : '💥 HAKUJ GO I ODZYSKAJ x3 (Obejrzyj Wideo)'}
                </button>
                {!isVendettaLoading && (
                    <button 
                      onClick={() => {
                          setShowVendettaModal(false);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors uppercase py-2 mt-2"
                    >
                      Zignoruj (Bity bezpowrotnie przepadają)
                    </button>
                )}
             </div>
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

            <PlayerProgress />
          </div>
        </div>
      )}

      {/* Hacker Event Modal */}
      {hackerEvent && hackerEvent.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-600 bg-red-950/80 p-6 flex flex-col items-center text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none animate-pulse"></div>
            
            {hackerEvent.isHacking ? (
              <div className="flex flex-col items-center justify-center py-8 relative z-10">
                <Network className="w-12 h-12 text-red-500 animate-spin mb-4" />
                <div className="text-red-500 font-bold uppercase tracking-widest animate-pulse">
                  Omijanie proxy...
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] flex items-center gap-2">
                  <AlertTriangle className="w-8 h-8 animate-bounce" /> ALARM!
                </h2>
                <p className="text-red-200 font-bold text-sm sm:text-base mb-6 relative z-10">
                  <span className="text-white">{hackerEvent.name}</span> przełamał Twój firewall i kradnie Bity!
                </p>
                
                <div className="flex flex-col gap-4 w-full relative z-10">
                  <button 
                    onClick={() => {
                        audio.play('click');
                        setHackerEvent({ ...hackerEvent, isHacking: true });
                        setTimeout(() => {
                            const reward = Math.max(1000, finalTotalIncome * 1500);
                            setCoins(prev => prev + reward);
                            setStats(prev => ({ ...prev, lifetimeBits: prev.lifetimeBits + reward, runBits: prev.runBits + reward }));
                            addToast("Zemsta udana! Wyczyściłeś mu serwer!", "critical");
                            audio.play('jackpot');
                            setHackerEvent(null);
                        }, 2000);
                    }}
                    className="w-full py-5 rounded-xl border-2 border-red-500 bg-red-600 text-white font-black text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    💥 HAKUJ GO
                  </button>
                  <button 
                    onClick={() => {
                        const loss = Math.min(coins, Math.max(100, finalTotalIncome * 50));
                        setCoins(prev => prev - loss);
                        addToast(`Skradziono ${formatNum(loss)} Bitów!`, "error");
                        setHackerEvent(null);
                    }}
                    className="text-xs text-red-300/50 hover:text-red-300 transition-colors uppercase tracking-wider py-2 bg-black/40 rounded-lg"
                  >
                    Zignoruj (Stracisz Bity)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowLeaderboard(false) }}>
          <div className="w-full max-w-sm rounded-2xl border border-yellow-500/50 bg-slate-900 p-6 flex flex-col items-center shadow-[0_0_30px_rgba(234,179,8,0.2)] relative overflow-hidden">
             <button onClick={() => setShowLeaderboard(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"><X className="w-5 h-5"/></button>
             <h2 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">
                <Trophy className="w-6 h-6" /> GLOBALNY RANKING ZAGROŻEŃ
             </h2>
             
             <button onClick={scrollToPlayer} className="mb-4 bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 px-4 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500/30 active:scale-95 transition-all z-10 relative">
                🎯 Znajdź Mnie
             </button>
             <div className="w-full flex flex-col gap-2 relative z-10 overflow-y-auto max-h-[65vh] hide-scrollbar pb-4">
                {leaderboardData.map((entry, i) => (
                      <div key={entry.id} ref={entry.isPlayer ? playerRowRef : null} className={`flex items-center justify-between p-3 rounded-lg border flex-shrink-0 ${entry.isPlayer ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] z-20' : 'bg-black/40 border-slate-800'}`}>
                         <div className="flex items-center gap-3 overflow-hidden">
                            <span className={`font-bold text-lg w-6 flex-shrink-0 text-center ${entry.isPlayer ? 'text-emerald-400' : 'text-slate-500'}`}>{i + 1}</span>
                            <span className={`font-bold truncate ${entry.isPlayer ? 'text-emerald-300' : 'text-slate-300'}`}>{entry.name}</span>
                         </div>
                         <span className={`font-mono text-sm flex-shrink-0 ml-2 ${entry.isPlayer ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{formatNum(entry.score)} B</span>
                      </div>
                   ))}
             </div>
          </div>
        </div>
      )}

      {/* Offline Earnings Modal */}
      {offlineEarnings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-blue-500/50 bg-slate-950 p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
             <h2 className="text-xl font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2 relative z-10">
                <Database className="w-6 h-6" /> RAPORT SYSTEMU OFFLINE
             </h2>
             <p className="text-blue-300/80 text-sm mb-6 relative z-10">
                Twoje wirusy kopały w tle przez <span className="font-bold text-white">{offlineEarnings.seconds} s</span>.
             </p>
             <div className="w-full bg-black/60 rounded-xl p-4 mb-6 border border-blue-900/50 flex flex-col gap-2 relative z-10">
                <div className="text-blue-400/60 text-xs uppercase">Wykopane Bity</div>
                <div className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                   +{formatNum(offlineEarnings.amount)}
                </div>
             </div>
             <div className="flex flex-col gap-3 w-full relative z-10">
                <button 
                  onClick={() => {
                      if (isPremium) {
                          setCoins(c => c + offlineEarnings.amount * 3);
                          audio.play('jackpot');
                          addToast(`Odebrano potrójnie (Premium): +${formatNum(offlineEarnings.amount * 3)}!`, "gold");
                          setOfflineEarnings(null);
                      } else {
                          addToast("Nawiązywanie połączenia...", "gray");
                          setTimeout(() => {
                              setCoins(c => c + offlineEarnings.amount * 3);
                              audio.play('jackpot');
                              addToast(`Odebrano potrójnie: +${formatNum(offlineEarnings.amount * 3)}!`, "gold");
                              setOfflineEarnings(null);
                          }, 2000);
                      }
                  }}
                  className="w-full py-4 rounded-xl border-2 border-emerald-500 bg-emerald-600/20 text-emerald-400 font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-600/40 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
                >
                  <Play className="w-6 h-6" /> 💰 ODBIERZ x3 (Obejrzyj Wideo)
                </button>
                <button 
                  onClick={() => {
                      setCoins(c => c + offlineEarnings.amount);
                      setOfflineEarnings(null);
                  }}
                  className="text-[10px] text-slate-600 hover:text-slate-500 transition-colors uppercase py-1 mt-2"
                >
                  Nie, wolę stracić większość Bitów i odebrać x1
                </button>
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
              : modalState.type === 'mercy'
              ? 'border-yellow-300 bg-slate-900/95 shadow-[0_0_40px_rgba(253,224,71,0.4)]'
              : 'border-emerald-500/50 bg-slate-900/95 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          }`}>
            {modalState.isWatching ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Network className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                <div className="text-yellow-400 font-bold uppercase tracking-widest animate-pulse">
                  Nawiązywanie...
                </div>
              </div>
            ) : modalState.type === 'zeroday_pity' ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-transparent to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-fuchsia-400 mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] animate-pulse flex items-center justify-center gap-2">
                  <Radiation className="w-6 h-6" /> OSTATNIA SZANSA
                </h2>
                <p className="text-fuchsia-200/90 text-xs sm:text-sm mb-6">
                  Czas ucieka, mięso. Twoje Klucze zaraz wyparują. Obejrzyj to, a rzucę Ci 1000 Kluczy ratunku.
                </p>
                <div className="flex flex-col gap-3 w-full relative z-10">
                  <button 
                    onClick={() => handleClaimModal()}
                    className="w-full py-4 rounded-xl border border-white/20 bg-gradient-to-r from-fuchsia-800 to-fuchsia-400 text-black font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]"
                  >
                    <Play className="w-6 h-6" /> ODBIERZ 1000 KLUCZY (Wideo)
                  </button>
                  <button 
                    onClick={() => setModalState(null)}
                    className="text-[10px] sm:text-xs text-fuchsia-500/50 hover:text-fuchsia-400 transition-colors uppercase tracking-wider py-2"
                  >
                    Bądź zniszczony
                  </button>
                </div>
              </>
            ) : modalState.type === 'mercy' ? (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent pointer-events-none"></div>
                <h2 className="text-xl font-bold text-yellow-300 mb-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] animate-pulse">
                  Złoty Zrzut (Litość)
                </h2>
                <p className="text-yellow-100/90 text-xs sm:text-sm mb-6">
                  Wyglądasz żałośnie na tym dnie. Obejrzyj wideo, a dostaniesz potężny zastrzyk waluty z litości.
                </p>
                <div className="flex flex-col gap-3 w-full relative z-10">
                  <button 
                    onClick={() => handleClaimModal()}
                    className="w-full py-4 rounded-xl border border-white/20 bg-gradient-to-r from-yellow-600 to-white/90 text-black font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 animate-[pulse_2s_ease-in-out_infinite]"
                  >
                    <Play className="w-6 h-6" /> Obejrzyj Wideo (BOOST x5)
                  </button>
                  <button 
                    onClick={() => setModalState(null)}
                    className="text-[10px] sm:text-xs text-yellow-500/50 hover:text-yellow-400 transition-colors uppercase tracking-wider py-2"
                  >
                    Odrzuć Pomoc
                  </button>
                </div>
              </>
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
                    <Play className="w-6 h-6" /> Obejrzyj Wideo (BOOST x10 na 120s)
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
                  className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${marketTab === 'upgrades' ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' : 'bg-black/40 border-emerald-900/40 text-emerald-700 hover:bg-emerald-950'}`}
                ><ShoppingCart className="w-4 h-4 mb-1" /> Ulepszenia</button>
                <button 
                  onClick={() => setMarketTab('prestige')} 
                  className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${marketTab === 'prestige' ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-black/40 border-red-900/40 text-red-700 hover:bg-red-950'}`}
                ><AlertTriangle className="w-4 h-4 mb-1" /> Rdzenie</button>
                <button 
                  onClick={() => setMarketTab('contracts')} 
                  className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${marketTab === 'contracts' ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'bg-black/40 border-blue-900/40 text-blue-700 hover:bg-blue-950'}`}
                ><Globe className="w-4 h-4 mb-1" /> Kontrakty</button>
                <button 
                  onClick={() => setMarketTab('dopalacze')} 
                  className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${marketTab === 'dopalacze' ? 'bg-fuchsia-900/50 border-fuchsia-500 text-fuchsia-400' : 'bg-black/40 border-fuchsia-900/40 text-fuchsia-700 hover:bg-fuchsia-950'}`}
                ><Zap className="w-4 h-4 mb-1" /> Dopalacze</button>
                <button 
                  onClick={() => setMarketTab('premium')} 
                  className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${marketTab === 'premium' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400' : 'bg-black/40 border-cyan-900/40 text-cyan-700 hover:bg-cyan-950'}`}
                ><ShieldAlert className="w-4 h-4 mb-1" /> Premium</button>
              </div>

              {isZeroDayActive && (
                  <button
                      onClick={() => {
                          setMarketTab('zeroday');
                          if (zeroDayTimeLeft < 60 && zeroDayKeys < 1000) {
                              setModalState({
                                  isOpen: true,
                                  type: 'zeroday_pity',
                                  reward: 1000,
                                  isWatching: false
                              });
                          }
                      }}
                      className={`w-full py-2 mb-4 rounded-lg text-xs uppercase tracking-widest font-bold border transition-colors animate-pulse ${marketTab === 'zeroday' ? 'bg-red-900/80 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-red-950/40 border-red-900/50 text-red-500 hover:bg-red-900/60'}`}
                  >
                      <AlertTriangle className="w-4 h-4 inline-block mr-2" />
                      ☢️ Sklep Zero-Day
                  </button>
              )}

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
              ) : marketTab === 'prestige' ? (
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
              ) : marketTab === 'contracts' ? (
                  <div className="flex flex-col gap-4">
                     <ContractItem 
                        id="iot_infil"
                        title="Infiltracja IoT (Zainstaluj oprogramowanie wroga)"
                        reward={Math.max(finalTotalIncome * 3000, 100000)}
                        isCompleted={completedContracts.includes('iot_infil')}
                        isVerifying={verifyingContracts.includes('iot_infil')}
                        buttonText="📲 Pobierz Payload"
                        onAccept={() => handleContractClick('iot_infil', Math.max(finalTotalIncome * 3000, 100000))}
                     />
                     <ContractItem 
                        id="id_theft"
                        title="Kradzież Tożsamości (Wypełnij profil analityczny)"
                        reward={Math.max(finalTotalIncome * 15000, 500000)}
                        isCompleted={completedContracts.includes('id_theft')}
                        isVerifying={verifyingContracts.includes('id_theft')}
                        buttonText="📋 Przechwyć Dane"
                        onAccept={() => handleContractClick('id_theft', Math.max(finalTotalIncome * 15000, 500000))}
                     />
                     <ContractItem 
                        id="crypto_heist"
                        title="Skok na kryptogiełdę (Załóż konto i złóż depozyt)"
                        reward={Math.max(finalTotalIncome * 100000, 5000000)}
                        isCompleted={completedContracts.includes('crypto_heist')}
                        isVerifying={verifyingContracts.includes('crypto_heist')}
                        buttonText="💎 Podejmij Kontrakt"
                        isDeepFunnel={true}
                        onAccept={() => handleContractClick('crypto_heist', Math.max(finalTotalIncome * 100000, 5000000))}
                     />
                  </div>
              ) : marketTab === 'dopalacze' ? (
                  <div className="flex flex-col gap-4 relative z-10">
                      <div className="bg-fuchsia-900/20 border border-fuchsia-500/50 rounded-xl p-4 flex flex-col gap-4">
                          <h3 className="text-fuchsia-400 font-bold uppercase flex items-center gap-2">
                              <Zap className="w-5 h-5" /> Dopalacze Czasowe
                          </h3>
                          <p className="text-fuchsia-300/70 text-sm font-medium">
                              Kwantowy Overclock wielokrotnie zwiększa wydajność rdzeni. Limit czasu sumuje się!
                          </p>
                          
                          <button
                              disabled={seasonScripts < 50}
                              data-locked={seasonScripts < 50 ? 'true' : 'false'}
                              onClick={() => {
                                  if (seasonScripts >= 50) {
                                      audio.play('click');
                                      setSeasonScripts(s => s - 50);
                                      setOverclockEndTime(prev => Math.max(Date.now(), prev) + 15 * 60 * 1000);
                                      addToast("⚡ OVERCLOCK AKTYWNY (15 MINUT)!", "gold");
                                  }
                              }}
                              className={`w-full py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                  seasonScripts >= 50
                                  ? 'border-fuchsia-500 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600/40 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] active:scale-95'
                                  : 'border-fuchsia-900/30 bg-fuchsia-950/20 text-fuchsia-900 cursor-not-allowed'
                              }`}
                          >
                              <span className="font-extrabold uppercase tracking-wider flex items-center gap-2 text-sm sm:text-base">
                                  <Zap className="w-5 h-5" /> OVERCLOCK (15 MINUT)
                              </span>
                              <span className="text-xs">Koszt: 50 Złośliwych Skryptów</span>
                          </button>
                      </div>
                  </div>
              ) : marketTab === 'premium' ? (
                  <div className="flex flex-col gap-4 relative z-10">
                     <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-xl p-4 flex flex-col gap-4">
                         <h3 className="text-cyan-400 font-bold uppercase flex items-center gap-2">
                             <ShieldAlert className="w-5 h-5" /> Status: {isPremium ? 'Aktywny' : 'Brak Uprawnień'}
                         </h3>
                         <p className="text-cyan-300/70 text-sm font-medium">
                             Dostęp do konta z uprawnieniami Administratora:
                         </p>
                         <ul className="text-cyan-300/60 text-xs space-y-2 list-disc pl-5">
                             <li>+50% globalnego mnożnika zysków</li>
                             <li>Auto-clicker działający z pełną prędkością Delta-Time</li>
                             <li>Odbieranie Zrzutów Pity i Litości, Zysków Offline bez konieczności czekania</li>
                             <li>Szacunek u R.0.0.T. AI</li>
                         </ul>
                         {!isPremium ? (
                             <button
                               onClick={() => {
                                   audio.play('jackpot');
                                   setIsPremium(true);
                                   addToast('Przyznano Uprawnienia Administratora!', 'gold');
                               }}
                               className="mt-2 w-full py-3 rounded-lg border border-cyan-500 bg-cyan-600/20 text-cyan-400 font-bold uppercase hover:bg-cyan-500/30 transition-colors"
                             >
                                 🔑 Autoryzuj (Premium)
                             </button>
                         ) : (
                             <div className="mt-2 w-full py-3 rounded-lg border border-cyan-500/50 bg-cyan-900/50 text-cyan-400 font-bold uppercase text-center opacity-70">
                                 Zautoryzowano
                             </div>
                         )}
                     </div>
                  </div>
              ) : marketTab === 'zeroday' && isZeroDayActive ? (
                  <div className="flex flex-col gap-4 relative z-10">
                      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 flex flex-col gap-4">
                          <h3 className="text-red-400 font-bold uppercase flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 animate-pulse" /> ELITARNY SKLEP ZERO-DAY
                          </h3>
                          <p className="text-red-300/70 text-sm font-medium">
                              Waluta wyparuje wraz z końcem protokołu. Kupuj natychmiast.
                          </p>
                          
                          <button
                              disabled={zeroDayKeys < 100}
                              data-locked={zeroDayKeys < 100 ? 'true' : 'false'}
                              onClick={() => {
                                  if (zeroDayKeys >= 100) {
                                      audio.play('click');
                                      setZeroDayKeys(k => k - 100);
                                      const reward = 1000 * finalTotalIncome;
                                      setCoins(c => c + reward);
                                      setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                                      addToast(`+${formatNum(reward)} BITÓW!`, "gold");
                                  }
                              }}
                              className={`w-full py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                  zeroDayKeys >= 100
                                  ? 'border-yellow-500 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95'
                                  : 'border-yellow-900/30 bg-yellow-950/20 text-yellow-900 cursor-not-allowed'
                              }`}
                          >
                              <span className="font-extrabold uppercase tracking-wider flex items-center gap-2 text-sm sm:text-base">
                                  <Star className="w-5 h-5" /> ZŁOTY TROJAN (1000s ZYSKU)
                              </span>
                              <span className="text-xs">Koszt: 100 Zaszyfrowanych Kluczy</span>
                          </button>

                          <button
                              disabled={zeroDayKeys < 1000}
                              data-locked={zeroDayKeys < 1000 ? 'true' : 'false'}
                              onClick={() => {
                                  if (zeroDayKeys >= 1000) {
                                      audio.play('jackpot');
                                      setZeroDayKeys(k => k - 1000);
                                      setZeroDayArtifacts(a => a + 1);
                                      addToast("ARTEFAKT POZYSKANY! +500% MNOŻNIKA!", "critical");
                                  }
                              }}
                              className={`w-full py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                  zeroDayKeys >= 1000
                                  ? 'border-red-500 bg-red-600/20 text-red-400 hover:bg-red-600/40 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] active:scale-95 animate-pulse'
                                  : 'border-red-900/30 bg-red-950/20 text-red-900 cursor-not-allowed'
                              }`}
                          >
                              <span className="font-extrabold uppercase tracking-wider flex items-center gap-2 text-sm sm:text-base">
                                  <Radiation className="w-5 h-5" /> ARTEFAKT ZERO-DAY (+500% NA ZAWSZE)
                              </span>
                              <span className="text-xs">Koszt: 1000 Zaszyfrowanych Kluczy</span>
                          </button>
                      </div>
                  </div>
              ) : null}
           </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-[40] bg-slate-950/95 flex flex-col items-center justify-center p-4 pb-24 overflow-y-auto w-full" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
           <div className="w-full max-w-sm rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 flex flex-col items-center relative">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-emerald-500/50 hover:text-emerald-400"><X size={24}/></button>
              <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-6">Ustawienia</h2>
              
              <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                      <span className="text-emerald-500 font-bold text-sm uppercase">Notacja Liczb</span>
                      <div className="flex bg-black/40 rounded-lg p-1 border border-emerald-900/40">
                          <button 
                            onClick={() => { setGlobalNotation('letters'); setNotationState('letters'); reportAction(); }}
                            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${notationState === 'letters' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              Literowa (1M, 1B)
                          </button>
                          <button 
                            onClick={() => { setGlobalNotation('scientific'); setNotationState('scientific'); reportAction(); }}
                            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${notationState === 'scientific' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              Naukowa (1e6)
                          </button>
                      </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                      <span className="text-emerald-500 font-bold text-sm uppercase">Soundtrack (Web Audio)</span>
                      <div className="flex flex-col gap-1 bg-black/40 rounded-lg p-2 border border-emerald-900/40">
                          <button 
                            onClick={() => { setSoundtrackType('none'); reportAction(); }}
                            className={`py-1.5 rounded font-bold text-xs transition-colors ${soundtrackType === 'none' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              [ WYŁĄCZONY ]
                          </button>
                          <button 
                            onClick={() => { setSoundtrackType('cyberpunk'); reportAction(); }}
                            className={`py-1.5 rounded font-bold text-xs transition-colors ${soundtrackType === 'cyberpunk' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              1. CYBERPUNK (Arp)
                          </button>
                          <button 
                            onClick={() => { setSoundtrackType('synthwave'); reportAction(); }}
                            className={`py-1.5 rounded font-bold text-xs transition-colors ${soundtrackType === 'synthwave' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              2. SYNTHWAVE (Hotline)
                          </button>
                          <button 
                            onClick={() => { setSoundtrackType('bossfight'); reportAction(); }}
                            className={`py-1.5 rounded font-bold text-xs transition-colors ${soundtrackType === 'bossfight' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              3. BOSS FIGHT (Megalovania vibe)
                          </button>
                          <button 
                            onClick={() => { setSoundtrackType('drone'); reportAction(); }}
                            className={`py-1.5 rounded font-bold text-xs transition-colors ${soundtrackType === 'drone' ? 'bg-emerald-600 text-black' : 'text-emerald-500 hover:bg-emerald-900/30'}`}
                          >
                              4. DARK DRONE (Ambiens)
                          </button>
                      </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                      <span className="text-emerald-500 font-bold text-sm uppercase">Wsparcie Projektu</span>
                      <button onClick={async () => {
                          const reward = Math.floor(Math.max(1000, baseTotalIncome * 3600));
                          try {
                              if (Capacitor.isNativePlatform()) {
                                  await AdMob.prepareRewardVideoAd({ adId: 'ca-app-pub-3940256099942544/5224354917' }); // Test Ad Unit ID
                                  await AdMob.showRewardVideoAd();
                                  // In real app, listen to RewardAdPluginEvents.Rewarded to give reward
                                  // For test purposes, we give reward immediately after show completes:
                                  audio.play('jackpot');
                                  setCoins(c => c + reward);
                                  setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                                  addToast(`+${formatNum(reward)} BITÓW (Z REKLAMY)`, 'gold');
                              } else {
                                  // Fake web simulation
                                  addToast('Ładowanie symulacji reklamy...', 'normal');
                                  setTimeout(() => {
                                      audio.play('jackpot');
                                      setCoins(c => c + reward);
                                      setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                                      addToast(`+${formatNum(reward)} BITÓW (Z REKLAMY)`, 'gold');
                                  }, 2000);
                              }
                          } catch(e) {
                              addToast('AdMob: Błąd Ładowania Reklamy', 'error');
                          }
                      }} className="w-full py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 rounded-lg font-bold hover:bg-yellow-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" /> OBEJRZYJ WIDEO (+1h Zysku)
                      </button>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                      <button 
                          onClick={() => setActiveModal('privacy')}
                          className="text-[10px] text-emerald-500/50 hover:text-emerald-400 underline underline-offset-2 transition-colors uppercase tracking-wider"
                      >
                          Polityka Prywatności
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-[50] bg-slate-950/95 flex flex-col items-center justify-center p-4 pb-24 overflow-y-auto w-full" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
           <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 flex flex-col relative max-h-[80vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-emerald-500/50 hover:text-emerald-400"><X size={24}/></button>
              <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-6 border-b border-emerald-500/30 pb-2">Polityka Prywatności Aplikacji / Gry Hacker Merge</h2>
              
              <div className="w-full flex flex-col gap-4 text-emerald-100 text-sm leading-relaxed">
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">1. Informacje Ogólne</h3>
                      <p>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony informacji w aplikacji/grze Hacker Merge.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">2. Zbieranie i Wykorzystanie Danych</h3>
                      <p>Aplikacja Hacker Merge nie zbiera, nie przechowuje ani nie przesyła żadnych danych osobowych użytkowników na zewnętrzne serwery. Wszystkie postępy w grze oraz ustawienia są zapisywane wyłącznie lokalnie na urządzeniu użytkownika.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">3. Dostęp do Funkcji Urządzenia</h3>
                      <p>Aplikacja wymaga podstawowych uprawnień do pamięci urządzenia (odczyt i zapis) wyłącznie w celu zapisywania i odczytywania stanu gry oraz jej prawidłowego działania na urządzeniu mobilnym. Aplikacja nie uzyskuje dostępu do innych prywatnych plików, kontaktów czy multimediów.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">4. Udostępnianie Danych Podmiotom Trzecim</h3>
                      <p>Ponieważ aplikacja nie gromadzi danych na zewnątrz, żadne informacje o użytkownikach nie są udostępniane, sprzedawane ani przekazywane podmiotom trzecim (w tym firmom analitycznym czy sieciom reklamowym).</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">5. Zarządzanie Danymi</h3>
                      <p>Pełna kontrola nad danymi pozostaje w rękach użytkownika. Z racji tego, że zapis gry jest w 100% lokalny, odinstalowanie aplikacji lub ręczne wyczyszczenie jej danych z poziomu ustawień urządzenia spowoduje nieodwracalne usunięcie całego zapisanego postępu.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">6. Zmiany w Polityce Prywatności</h3>
                      <p>Wszelkie ewentualne zmiany w niniejszej Polityce Prywatności będą publikowane bezpośrednio na tej stronie.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-emerald-400 mb-1">7. Kontakt</h3>
                      <p>W razie jakichkolwiek pytań dotyczących niniejszej Polityki Prywatności, prosimy o kontakt pod adresem e-mail: <a href="mailto:ferraeter@gmail.com" className="text-emerald-400 underline hover:text-emerald-300">ferraeter@gmail.com</a>.</p>
                  </div>
              </div>
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
                data-locked={isCasinoDisabled ? 'true' : 'false'}
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

      {/* Siatka Modal */}
      {activeModal === 'siatka' && (
        <div className="fixed inset-0 z-[40] bg-slate-950/95 flex flex-col items-center p-4 pt-8 pb-24 overflow-y-auto w-full" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}>
           <div className="w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 uppercase tracking-widest shadow-emerald-500/50 drop-shadow-md">Cyber-Siatka (Sezon 1)</h2>
                  <button onClick={() => setActiveModal(null)} className="text-emerald-500/50 hover:text-emerald-400"><X size={28}/></button>
              </div>

              <div className="text-center text-xs sm:text-sm font-mono text-emerald-500 mb-4 bg-emerald-950/20 border border-emerald-900/50 p-2 rounded-lg">
                  PENETRACJA SIECI: [{(() => {
                      const filled = Math.floor((unlockedNodes.length / 12) * 10);
                      return '█'.repeat(filled) + '-'.repeat(10 - filled);
                  })()}] {Math.floor((unlockedNodes.length / 12) * 100)}%
                  <div className="mt-2 text-emerald-300 font-sans">
                      Złośliwe Skrypty: <span className="font-bold text-emerald-400">{seasonScripts}</span>
                  </div>
              </div>

              {!hasBattlePass && (
                  <button 
                      onClick={() => {
                          audio.play('click');
                          setHasBattlePass(true);
                          addToast("Kod ROOT zaakceptowany! Uzyskano pełen dostęp.", "gold");
                      }}
                      className="w-full py-4 mb-6 rounded-xl border border-cyan-500 bg-cyan-900/30 text-cyan-400 font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-800/40 active:scale-95 transition-all flex justify-center items-center gap-2"
                  >
                      <Lock className="w-5 h-5" /> 💳 KUP KOD ROOT (BATTLE PASS) - 4.99 USD
                  </button>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {Array.from({ length: 12 }).map((_, index) => {
                      const isPremiumNode = index >= 8;
                      const isUnlocked = unlockedNodes.includes(index);
                      
                      return (
                          <button
                              key={index}
                              disabled={isUnlocked}
                              data-locked={isUnlocked ? 'true' : 'false'}
                              onClick={() => {
                                  if (isUnlocked) return;
                                  if (isPremiumNode && !hasBattlePass) {
                                      addToast("Zabezpieczenia Wojskowe! Wymagany Kod ROOT!", "error");
                                      return;
                                  }
                                  if (seasonScripts < 10) {
                                      addToast("Brak Złośliwych Skryptów (Wymagane 10)!", "error");
                                      return;
                                  }
                                  
                                  audio.play('click');
                                  setSeasonScripts(s => s - 10);
                                  setUnlockedNodes(prev => [...prev, index]);
                                  
                                  if (isPremiumNode) {
                                      const reward = finalTotalIncome * 43200;
                                      setCoins(c => c + reward);
                                      setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                                      addToast("Sektor wojskowy przejęty! Zysk +12h", "gold");
                                  } else {
                                      const reward = finalTotalIncome * 3600;
                                      setCoins(c => c + reward);
                                      setStats(s => ({...s, lifetimeBits: s.lifetimeBits + reward, runBits: s.runBits + reward}));
                                      addToast("Zhakowano pomyślnie! Zysk +1h", "gold");
                                  }
                              }}
                              className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all p-1 sm:p-2 ${
                                  isUnlocked
                                  ? (isPremiumNode 
                                      ? 'border-fuchsia-500/80 bg-fuchsia-900/40 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)] opacity-80 cursor-not-allowed'
                                      : 'border-emerald-500/80 bg-emerald-900/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] opacity-80 cursor-not-allowed')
                                  : (isPremiumNode
                                      ? 'border-purple-500/40 bg-purple-950/30 text-purple-400 hover:bg-purple-900/40 hover:border-purple-400/60 active:scale-95'
                                      : 'border-emerald-900/50 bg-slate-900/50 text-emerald-700/80 hover:bg-emerald-900/30 hover:text-emerald-500 active:scale-95')
                              }`}
                          >
                              {isUnlocked ? (
                                  <>
                                      <Unlock className={`w-5 h-5 sm:w-6 sm:h-6 ${isPremiumNode ? 'text-fuchsia-400' : 'text-emerald-400'}`} />
                                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-center">Zhakowany</span>
                                  </>
                              ) : isPremiumNode ? (
                                  <>
                                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                      <span className="text-[8px] sm:text-[10px] font-bold uppercase text-center text-purple-300">Wojskowy<br/>(10 Skryptów)</span>
                                  </>
                              ) : (
                                  <>
                                      <Globe className="w-5 h-5 sm:w-6 sm:h-6 opacity-60" />
                                      <span className="text-[8px] sm:text-[10px] font-bold uppercase text-center">Węzeł<br/>(10 Skryptów)</span>
                                  </>
                              )}
                          </button>
                      );
                  })}
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[64px] z-[45] bg-black/90 border-t border-emerald-500/50 flex justify-around items-center px-1 pb-safe backdrop-blur-md">
        <button onClick={() => { setActiveModal(null); setShowLeaderboard(false); }} className={`flex flex-col items-center w-[18%] transition-colors ${activeModal === null && !showLeaderboard ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Terminal className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Terminal</span>
        </button>
        <button onClick={() => { setActiveModal('market'); setShowLeaderboard(false); }} className={`flex flex-col items-center w-[18%] transition-colors ${activeModal === 'market' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <ShoppingCart className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Market</span>
        </button>
        <button onClick={() => { setActiveModal('casino'); setShowLeaderboard(false); }} className={`flex flex-col items-center w-[18%] transition-colors ${activeModal === 'casino' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Dices className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Kasyno</span>
        </button>
        <button onClick={() => { setActiveModal('siatka'); setShowLeaderboard(false); }} className={`flex flex-col items-center w-[18%] transition-colors ${activeModal === 'siatka' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Globe className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Siatka</span>
        </button>
        <button onClick={() => { setShowLeaderboard(true); setActiveModal(null); }} className={`flex flex-col items-center w-[18%] transition-colors ${showLeaderboard ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}`}>
          <Trophy className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Ranking</span>
        </button>
      </div>

      {/* Zero-Day Event Bar */}
      {isZeroDayActive && (
          <div className="w-full max-w-lg mb-1 border border-red-500 rounded-xl p-2 bg-red-950/80 backdrop-blur-md relative z-10 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex-shrink-0 flex flex-col gap-1 overflow-hidden animate-pulse">
             <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.1)_10px,rgba(239,68,68,0.1)_20px)] opacity-50"></div>
             <div className="relative z-10 flex justify-between items-center px-1">
                 <div className="flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                     <span className="text-red-400 font-extrabold uppercase tracking-widest text-sm sm:text-base drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                         PROTOKÓŁ ZERO-DAY
                     </span>
                 </div>
                 <div className="text-red-500 font-mono font-bold text-lg">
                     {(() => {
                         const m = Math.floor(zeroDayTimeLeft / 60);
                         const s = zeroDayTimeLeft % 60;
                         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                     })()}
                 </div>
             </div>
             <div className="relative z-10 flex justify-between items-center px-1 bg-black/40 rounded py-1 border border-red-900/50 mt-1">
                 <span className="text-[10px] text-fuchsia-400 font-bold uppercase">Zaszyfrowane Klucze:</span>
                 <span className="text-fuchsia-300 font-bold drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] flex items-center gap-1">
                     <Key className="w-3 h-3" /> {formatNum(zeroDayKeys)}
                 </span>
             </div>
          </div>
      )}

      {/* Header Panel */}
      <div className="w-full max-w-lg mb-1 border border-emerald-500/30 rounded-xl p-2 bg-black/40 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(m => !m)} className="text-emerald-500 hover:text-emerald-400 transition-colors p-1 rounded hover:bg-emerald-900/30">
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button onClick={() => setActiveModal('settings')} className="text-emerald-500 hover:text-emerald-400 transition-colors p-1 rounded hover:bg-emerald-900/30">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {dropTimer === 0 ? (
               <button 
                  onClick={handleClaimDropClick}
                  className="px-2 py-1 rounded-lg border border-purple-500/60 bg-purple-900/30 font-bold text-[10px] uppercase tracking-widest text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-800/40 active:scale-95 cursor-pointer animate-pulse flex items-center gap-1"
               >
                 <Gift className="w-3 h-3" /> ZDEKODUJ ZRZUT
               </button>
            ) : (
               <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-900/50 font-bold text-[10px] uppercase text-slate-500 flex items-center gap-1">
                 <Gift className="w-3 h-3" /> {dropTimer}s
               </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isBoostActive && (
                <div className="px-2 py-1 rounded-lg border border-yellow-500/60 bg-yellow-900/30 text-[10px] font-bold uppercase text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.3)] animate-pulse flex items-center gap-1">
                    <span>BOOST x{boostMultiplierValue}</span>
                    <span className="opacity-80">⏳ {boostTimeLeft}s</span>
                </div>
            )}
            <button onClick={() => setShowStatsModal(true)} className="bg-black/60 backdrop-blur-md border border-emerald-500/50 text-emerald-400 p-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:bg-emerald-900/40 active:scale-95 transition-all flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold hidden sm:inline">Rdzenie: {stats.quantumCores}</span>
                <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <div className={`bg-black/60 backdrop-blur-md border p-1.5 rounded-xl flex items-center gap-1 ${isShadowbanned ? 'border-red-500/50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'}`}>
                <Save className={`w-3.5 h-3.5 transition-all duration-300 ${isSaving ? 'animate-spin text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] scale-110' : ''}`} />
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
      <div 
        onClick={() => {
            const quotes = isPremium ? PREMIUM_ROOT_QUOTES : ROOT_QUOTES;
            setRootMessage(quotes[Math.floor(Math.random() * quotes.length)]);
            audio.play('click');
            reportAction();
        }}
        className={`w-full max-w-lg mb-1 border rounded-xl p-2 bg-black/60 backdrop-blur-md relative z-10 flex items-center gap-3 transition-colors duration-300 cursor-pointer active:scale-95 active:animate-bounce ${isOverdrive ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : (isPremium ? 'border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:border-cyan-400/50' : 'border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:border-emerald-400/50')}`}
      >
          <div className={`p-1.5 rounded-lg border ${isOverdrive ? 'bg-red-900/50 border-red-500 text-red-400' : (isPremium ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400' : 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400')}`}>
              <Skull className="w-5 h-5" style={(!isPremium || isOverdrive) ? { filter: 'drop-shadow(-2px 0px 0px rgba(0,255,255,0.5)) drop-shadow(2px 0px 0px rgba(255,0,0,0.5))' } : {}} />
          </div>
          <div className="flex flex-col overflow-hidden">
              <span className={`text-[9px] uppercase font-bold tracking-widest ${isOverdrive ? 'text-red-500' : (isPremium ? 'text-cyan-500' : 'text-emerald-600')}`}>
                  {isPremium ? 'System Administrator' : 'R.0.0.T. AI'}
              </span>
              <span 
                className={`text-xs sm:text-sm font-medium truncate ${isOverdrive ? 'text-red-400' : (isPremium ? 'text-cyan-300' : 'text-emerald-300')} ${isIdle && !isPremium ? 'glitch-text' : ''}`}
                data-text={rootMessage}
                style={(!isPremium || isOverdrive) ? { textShadow: '-1.5px 0px 0px rgba(0, 255, 255, 0.6), 1.5px 0px 0px rgba(255, 0, 0, 0.6)' } : {}}
              >
                  {rootMessage}
              </span>
          </div>
      </div>

      {/* Szyfrowany Portfel Panel */}
      {/* (Usunięto) */}

      {/* Grid Container */}
      <div className="flex items-center justify-center relative z-10 mb-1 w-full max-w-lg flex-1 min-h-0 min-w-0">
        <div 
          className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1.5 sm:p-2 border border-emerald-500/20 rounded-2xl bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] mx-auto min-h-0 min-w-0"
          style={{ height: '100%', maxHeight: '380px', maxWidth: '100%', aspectRatio: '1/1' }}
        >
          {grid.map((slot, index) => {
            const isMerged = mergedIndex === index;
            const config = slot ? getLevelConfig(slot.level) : null;
            const Icon = config ? config.icon : null;
            return (
              <div
                key={index}
                data-index={index}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`grid-slot w-full h-full border border-emerald-900/40 rounded-xl bg-slate-900/30 flex items-center justify-center relative transition-transform duration-200 aspect-square ${dragOverIndex === index ? 'scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20' : ''}`}
              >
                {slot && config && Icon && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`absolute inset-0 sm:inset-0.5 border border-emerald-500/30 rounded-xl bg-slate-900/80 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-emerald-900/30 hover:border-emerald-500/50 shadow-inner touch-none ${
                      isMerged 
                        ? 'scale-[1.25] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200' 
                        : 'idle-float transition-all duration-300'
                    }`}
                    style={{ animationDelay: `${index * 0.15}s` }}
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
        
        <div className="w-full text-[9px] sm:text-[10px] text-emerald-500/60 flex items-center gap-2 px-2 overflow-hidden bg-black/20 rounded-lg py-0.5 border border-emerald-900/30">
          <span className="animate-pulse">{'>_'}</span>
          <span className="truncate">{logText}</span>
        </div>
      </div>

      {/* Overclock Indicator */}
      {overclockEndTime > Date.now() && (
          <div className={`w-full max-w-lg mb-1 text-center font-bold tracking-widest uppercase text-xs sm:text-sm py-1 rounded border bg-black/40 ${
              overclockEndTime - Date.now() < 60000 
                  ? 'text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
                  : 'text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.3)] animate-pulse'
          }`}>
              ⚡ OVERCLOCK AKTYWNY: {(() => {
                  const s = Math.max(0, Math.floor((overclockEndTime - Date.now()) / 1000));
                  return `${Math.floor(s/60).toString().padStart(2, '0')}:${(s%60).toString().padStart(2, '0')}`;
              })()}
          </div>
      )}

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

      {/* Overclock Shortcut */}
      {overclockEndTime <= Date.now() && seasonScripts >= 50 && (
          <button
              onClick={() => {
                  audio.play('click');
                  setSeasonScripts(s => s - 50);
                  setOverclockEndTime(prev => Math.max(Date.now(), prev) + 15 * 60 * 1000);
                  addToast("⚡ OVERCLOCK AKTYWNY!", "gold");
              }}
              className="w-full max-w-lg mb-0.5 relative z-10 px-2 py-1 rounded-lg border border-fuchsia-500/50 bg-fuchsia-950/40 text-fuchsia-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-fuchsia-900/60 shadow-[0_0_10px_rgba(217,70,239,0.2)]"
          >
              <Zap className="w-3 h-3" /> [ KUP OVERCLOCK ] (50 Skryptów)
          </button>
      )}

      {/* Footer / Buy Script */}
      <div className="w-full max-w-lg flex flex-col items-center flex-shrink-0 pb-1 relative z-10">
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          data-locked={!canBuy ? 'true' : 'false'}
          className={`w-full rounded-xl relative z-10 px-4 py-1.5 sm:py-2 border font-bold text-sm sm:text-base transition-all uppercase tracking-wider shadow-lg ${
            canBuy 
              ? 'border-emerald-500/80 text-emerald-950 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer' 
              : 'border-emerald-900/50 text-emerald-800 bg-emerald-950/20 active:scale-95'
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
          <div className="flex-1 flex justify-end gap-2 flex-wrap">
             <button onClick={() => {
                 setIsZeroDayActive(true);
                 setZeroDayTimeLeft(180);
                 setZeroDayKeys(0);
                 audio.play('jackpot');
                 addToast("PROTOKÓŁ ZERO-DAY ROZPOCZĘTY!", "critical");
             }} className="text-[8px] text-fuchsia-900/60 hover:text-fuchsia-500/80 transition-colors">[Dev: Start Zero-Day]</button>
             <button onClick={() => setIsShadowbanned(s => !s)} className={`text-[8px] transition-colors ${isShadowbanned ? 'text-red-500/80' : 'text-emerald-900/60 hover:text-emerald-500/80'}`}>[Dev: Toggle Shadowban]</button>
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
      data-locked={!canAfford ? 'true' : 'false'}
      className={`w-full rounded-xl border p-3 flex items-center justify-between transition-all ${
        canAfford 
          ? 'border-emerald-500/40 text-emerald-400 bg-black/40 backdrop-blur-md hover:bg-emerald-900/40 cursor-pointer active:scale-95 hover:border-emerald-500/60' 
          : 'border-emerald-900/30 text-emerald-800 bg-black/20 hover:bg-black/40 active:scale-95'
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

function ContractItem({ id, title, reward, isCompleted, isVerifying, buttonText, isDeepFunnel, onAccept }: any) {
  return (
    <div className={`w-full rounded-xl border p-4 flex flex-col gap-3 transition-all ${isCompleted ? 'border-slate-800 bg-black/60 opacity-50' : isDeepFunnel ? 'border-yellow-500/50 bg-black/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'border-blue-900/40 bg-black/40'}`}>
        <div className="flex flex-col">
            <span className={`font-bold text-sm sm:text-base ${isCompleted ? 'text-slate-500' : isDeepFunnel ? 'text-yellow-400' : 'text-blue-400'}`}>{title}</span>
            <span className="text-[10px] sm:text-xs text-emerald-400 font-mono mt-1">Nagroda: +{formatNum(reward)} B</span>
        </div>
        <button
            onClick={onAccept}
            disabled={isCompleted || isVerifying}
            data-locked={isCompleted || isVerifying ? 'true' : 'false'}
            className={`w-full py-2.5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border ${
                isCompleted 
                ? 'border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed'
                : isVerifying
                ? 'border-orange-500/50 bg-orange-900/20 text-orange-400 cursor-wait animate-pulse'
                : isDeepFunnel
                ? 'border-yellow-500 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-500/30 active:scale-95 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                : 'border-blue-500 bg-blue-600/20 text-blue-400 hover:bg-blue-500/30 active:scale-95'
            }`}
        >
            {isCompleted ? '🔒 WĘZEŁ SPALONY (Zakończono)' : isVerifying ? '⏳ Weryfikacja sygnatury S2S...' : buttonText}
        </button>
    </div>
  );
}
