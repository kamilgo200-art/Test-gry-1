const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the buttons in Settings Modal
const oldBtns = `<div className="mt-4 flex flex-col items-center gap-2">
                      <button 
                          onClick={() => setActiveModal('feedback')}
                          className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg font-bold hover:bg-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <MessageSquare className="w-4 h-4" /> WYŚLIJ OPINIĘ (+5 DARKCOINÓW)
                      </button>
                      <button 
                          onClick={() => setActiveModal('privacy')}
                          className="text-[10px] text-emerald-500/50 hover:text-emerald-400 underline underline-offset-2 transition-colors uppercase tracking-wider"
                      >
                          Polityka Prywatności
                      </button>
                  </div>`;

const newBtns = `<div className="mt-4 flex flex-col items-center gap-2">
                      <button 
                          onClick={() => window.open('https://play.google.com/store/apps/details?id=com.hackermerge.game', '_blank')}
                          className="w-full py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 rounded-lg font-bold hover:bg-yellow-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <Star className="w-4 h-4" /> OCEŃ GRĘ (GOOGLE PLAY)
                      </button>
                      <button 
                          onClick={() => window.open('https://discord.gg/hackermerge', '_blank')}
                          className="w-full py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 rounded-lg font-bold hover:bg-indigo-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <MessageSquare className="w-4 h-4" /> SPOŁECZNOŚĆ (DISCORD)
                      </button>
                      <button 
                          onClick={() => setActiveModal('feedback')}
                          className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg font-bold hover:bg-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <MessageSquare className="w-4 h-4" /> ZGŁOŚ UWAGI {hasSubmittedFeedback ? '' : '(+5 DARKCOINÓW)'}
                      </button>
                      <button 
                          onClick={() => setActiveModal('privacy')}
                          className="text-[10px] text-emerald-500/50 hover:text-emerald-400 underline underline-offset-2 transition-colors uppercase tracking-wider mt-2"
                      >
                          Polityka Prywatności
                      </button>
                  </div>`;
code = code.replace(oldBtns, newBtns);

// 2. Replace spam filter logic in Feedback Modal
const oldFilter = `if (feedbackText.trim().length > 5) {`;
const newFilter = `const cleanText = feedbackText.trim();
                          const uniqueChars = new Set(cleanText.replace(/\\s/g, '').toLowerCase()).size;
                          const hasRepeating = /(.)\\1{4,}/.test(cleanText);
                          if (cleanText.length >= 20 && uniqueChars >= 5 && !hasRepeating) {`;
code = code.replace(oldFilter, newFilter);

const oldError = `addToast('Opinia jest zbyt krótka.', 'error');`;
const newError = `addToast('Opinia musi mieć min. 20 znaków i mieć sens (bez spamu).', 'error');`;
code = code.replace(oldError, newError);

fs.writeFileSync('src/App.tsx', code);
console.log('patched spam and rate');
