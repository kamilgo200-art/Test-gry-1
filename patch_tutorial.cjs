const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variable
const stateInitial = "const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState<boolean>(() => getInitialState('hasSubmittedFeedback', false));";
code = code.replace(
  stateInitial,
  `${stateInitial}\n  const [tutorialStep, setTutorialStep] = useState<number>(() => getInitialState('tutorialStep', 0));`
);

// 2. Add tutorialStep to save array
const saveStr = "isZeroDayActive, zeroDayTimeLeft, zeroDayKeys, zeroDayArtifacts, bitcoins, premiumAutoclickers, hasSubmittedFeedback";
code = code.replace(
  saveStr,
  saveStr + ", tutorialStep"
);
const saveStr2 = "isZeroDayActive, zeroDayTimeLeft, zeroDayKeys, zeroDayArtifacts, bitcoins, premiumAutoclickers, hasSubmittedFeedback]);";
code = code.replace(
  saveStr2,
  "isZeroDayActive, zeroDayTimeLeft, zeroDayKeys, zeroDayArtifacts, bitcoins, premiumAutoclickers, hasSubmittedFeedback, tutorialStep]);"
);

// 3. Add Tutorial component at top
const tutorialComponent = `const TutorialTooltip = ({ children, arrow = 'down' }: { children: React.ReactNode, arrow?: 'up' | 'down' | 'left' | 'right' }) => (
  <div className="absolute z-[200] bg-cyan-900 border-2 border-cyan-400 text-cyan-100 p-3 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.8)] text-xs sm:text-sm font-bold tracking-wide animate-bounce pointer-events-none w-max max-w-[220px] text-center">
      {children}
      <div className={\`absolute w-3 h-3 bg-cyan-900 border-cyan-400 transform rotate-45 \${
          arrow === 'down' ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-b-2 border-r-2' : 
          arrow === 'up' ? 'top-[-7px] left-1/2 -translate-x-1/2 border-t-2 border-l-2' : ''
      }\`} />
  </div>
);`;
code = code.replace("function GameApp() {", tutorialComponent + "\n\nfunction GameApp() {");

// 4. Add tutorial effect
const tutorialEffect = `
  useEffect(() => {
     if (tutorialStep === 0 && coins >= scriptCost) setTutorialStep(1);
     else if (tutorialStep === 1 && grid.filter(s => s !== null).length >= 1) setTutorialStep(2);
     else if (tutorialStep === 2 && grid.filter(s => s !== null).length >= 2) setTutorialStep(3);
     else if (tutorialStep === 3 && grid.some(s => s !== null && s.level >= 2)) setTutorialStep(4);
     else if (tutorialStep === 4 && activeModal === 'market') setTutorialStep(5);
  }, [tutorialStep, coins, scriptCost, grid, activeModal]);
`;
code = code.replace("// FRUSTRATION & PITY", tutorialEffect + "\n  // FRUSTRATION & PITY");

// 5. Add Tooltips to UI
// A. Over Main Clicker
const clickerMatch = `<button
        id="manual-attack-btn"`;
code = code.replace(clickerMatch, `<div className="relative w-full max-w-lg mb-0.5 flex-shrink-0">
        {tutorialStep === 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[200]">
                <TutorialTooltip arrow="down">Kliknij terminal, by wykopać Bity!</TutorialTooltip>
            </div>
        )}
      <button
        id="manual-attack-btn"`);
// Close the wrapper div after the button
const clickerEnd = `</button>
      {/* Overclock Shortcut */}`;
code = code.replace(clickerEnd, `</button>\n      </div>\n      {/* Overclock Shortcut */}`);

// B. Over Grid
const gridStart = `<div 
          className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1.5 sm:p-2 border border-emerald-500/20 rounded-2xl bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] mx-auto min-h-0 min-w-0"`;
const gridStartReplaced = `<div 
          className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1.5 sm:p-2 border border-emerald-500/20 rounded-2xl bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] mx-auto min-h-0 min-w-0 relative"`;
code = code.replace(gridStart, gridStartReplaced);
const gridInner = `{grid.map((slot, index) => {`;
code = code.replace(gridInner, `{tutorialStep === 3 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-[200]">
                <TutorialTooltip arrow="down">
                    Połącz dwa skrypty poziomu 1! (Złap i upuść jeden na drugi)
                </TutorialTooltip>
            </div>
          )}\n          {grid.map((slot, index) => {`);

// C. Over Buy Script
const buyScript = `<button
          onClick={handleBuy}
          disabled={!canBuy}
          data-locked={!canBuy ? 'true' : 'false'}`;
code = code.replace(buyScript, `<div className="relative w-full">
            {(tutorialStep === 1 || tutorialStep === 2) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[200]">
                    <TutorialTooltip arrow="down">
                        {tutorialStep === 1 ? "Kup pierwszy Złośliwy Skrypt!" : "Kup drugi taki sam Skrypt!"}
                    </TutorialTooltip>
                </div>
            )}
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          data-locked={!canBuy ? 'true' : 'false'}`);
const buyScriptEnd = `Kompiluj Skrypt ({formatNum(scriptCost)})
        </button>`;
code = code.replace(buyScriptEnd, `Kompiluj Skrypt ({formatNum(scriptCost)})\n        </button>\n        </div>`);

// D. Over Market in Bottom Nav
const marketNav = `<button onClick={() => { setActiveModal('market'); setShowLeaderboard(false); }} className={\`flex flex-col items-center w-[18%] transition-colors \${activeModal === 'market' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}\`}>`;
code = code.replace(marketNav, `<button onClick={() => { setActiveModal('market'); setShowLeaderboard(false); }} className={\`relative flex flex-col items-center w-[18%] transition-colors \${activeModal === 'market' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-emerald-700 hover:text-emerald-500'}\`}>
          {tutorialStep === 4 && (
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[200]">
                 <TutorialTooltip arrow="down">Otwórz Market!</TutorialTooltip>
             </div>
          )}`);

fs.writeFileSync('src/App.tsx', code);
console.log('patched tutorial');
