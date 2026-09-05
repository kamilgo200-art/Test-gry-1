import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MousePointerClick,
  Sparkles,
  RefreshCw,
  Rocket,
  ShieldAlert
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialStep: number;
  onRestartTutorial: () => void;
}

const STEPS = [
  {
    title: 'Witaj w Hacker Merge!',
    desc: 'Twoim celem jest stworzenie najpotężniejszej sieci botów i wirusów na świecie. Klikaj przycisk "Zainfekuj System", aby zdobywać pierwsze Bity, lub zbieraj pasywny zysk z malware.',
    icon: MousePointerClick,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
  },
  {
    title: 'Kompilacja i Łączenie (Merge)',
    desc: 'Kupuj skrypty za bity, a następnie łącz dwa identyczne wirusy tego samego poziomu (np. dwa poziomu 1 dają poziom 2)! Każdy kolejny poziom wirusa podwaja zyski wykładniczo.',
    icon: Sparkles,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
  },
  {
    title: 'Rynek i Ulepszenia',
    desc: 'Otwórz Rynek, by kupować Botnety, Krypto-Koparki i Dopalacze czasu. Ulepszaj kliknięcia, aby generować miliony bitów jednym ruchem palca.',
    icon: ShieldAlert,
    color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40'
  },
  {
    title: 'Formatowanie Dysku (Prestiż)',
    desc: 'Gdy zbierzesz ponad 10M bitów, sformatuj dysk, by zyskać Rdzenie Kwantowe. Każdy Rdzeń daje stałe +100% zysku do każdego kolejnego biegu!',
    icon: RefreshCw,
    color: 'text-purple-400 border-purple-500/40 bg-purple-950/40'
  },
  {
    title: 'Stacja Kosmiczna i Qubity',
    desc: 'Nowy tryb kosmiczny! Kliknij ikonę Rakiety w nagłówku, by zarządzać stacją na orbicie, budować sondy kwantowe i gromadzić Qubity, dające potężny mnożnik dla naziemnej infrastruktury!',
    icon: Rocket,
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/40'
  }
];

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  tutorialStep,
  onRestartTutorial
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[activeStep];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto w-full select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-slate-950 border border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-500/60 hover:text-emerald-300 rounded-xl hover:bg-emerald-950/40 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-emerald-900/50 pb-3">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-300">
            Samouczek Operacyjny
          </h2>
        </div>

        {/* Step Visual Card */}
        <div className="bg-black/60 border border-emerald-900/40 rounded-2xl p-5 flex flex-col items-center text-center gap-4 mb-5">
          <div className={`p-4 rounded-2xl border ${current.color} shadow-lg`}>
            <Icon className="w-10 h-10" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono text-emerald-500 font-bold block mb-1">
              Krok {activeStep + 1} z {STEPS.length}
            </span>
            <h3 className="text-lg font-black text-white mb-2">{current.title}</h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-sans">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-5">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-2 rounded-full transition-all ${
                activeStep === idx
                  ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'w-2 bg-emerald-950 hover:bg-emerald-800'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          {activeStep > 0 && (
            <button
              onClick={() => setActiveStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-emerald-900/50 bg-slate-900 text-emerald-400 font-bold text-xs uppercase tracking-wider hover:bg-emerald-950/50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Wstecz
            </button>
          )}
          {activeStep < STEPS.length - 1 ? (
            <button
              onClick={() => setActiveStep((s) => s + 1)}
              className="flex-1 py-2.5 rounded-xl border border-emerald-500 bg-emerald-600/30 text-emerald-300 font-bold text-xs uppercase tracking-wider hover:bg-emerald-500/40 active:scale-95 flex items-center justify-center gap-1 shadow-md"
            >
              Dalej <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-emerald-400 bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 active:scale-95 flex items-center justify-center gap-1 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> Rozumiem, Zaczynajmy!
            </button>
          )}
        </div>

        {/* Reset tooltips option */}
        <button
          onClick={() => {
            onRestartTutorial();
            onClose();
          }}
          className="mt-4 text-center text-[10px] text-emerald-600 hover:text-emerald-400 underline uppercase tracking-wider"
        >
          Zresetuj interaktywne podpowiedzi na planszy
        </button>
      </div>
    </div>
  );
};
