const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const premiumSection = `                     </div>
                  </div>
              ) : marketTab === 'zeroday'`;

const newPremiumSection = `                     </div>
                     
                     <div className="bg-orange-900/20 border border-orange-500/50 rounded-xl p-4 flex flex-col gap-4">
                         <h3 className="text-orange-400 font-bold uppercase flex items-center gap-2">
                             <Bitcoin className="w-5 h-5" /> Dark Web Autoclicker
                         </h3>
                         <p className="text-orange-300/70 text-xs font-medium">
                             Premium Autoclicker. Fizycznie klika przycisk MANUALNY ATAK z prędkością 1 kliknięcie/sekundę za każdy posiadany egzemplarz!
                         </p>
                         <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg border border-orange-900/40">
                             <span className="text-xs text-orange-400">Posiadasz: <span className="font-bold text-orange-300">{premiumAutoclickers}</span> szt.</span>
                             <span className="text-xs text-orange-400">Zysk: <span className="font-bold text-orange-300">{premiumAutoclickers}x</span> klik/s</span>
                         </div>
                         <button
                           disabled={bitcoins < 1}
                           data-locked={bitcoins < 1 ? 'true' : 'false'}
                           onClick={() => {
                               if (bitcoins >= 1) {
                                   audio.play('click');
                                   setBitcoins(b => b - 1);
                                   setPremiumAutoclickers(p => p + 1);
                                   addToast('Zakupiono Dark Web Autoclicker!', 'gold');
                               }
                           }}
                           className={\`mt-2 w-full py-3 rounded-lg border font-bold uppercase transition-colors \${
                               bitcoins >= 1 
                               ? 'border-orange-500 bg-orange-600/20 text-orange-400 hover:bg-orange-500/30' 
                               : 'border-orange-900/30 bg-orange-950/20 text-orange-900 cursor-not-allowed'
                           }\`}
                         >
                             <span className="flex items-center justify-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Kup Autoclicker (1 DarkCoin)
                             </span>
                         </button>
                     </div>
                  </div>
              ) : marketTab === 'zeroday'\`;`;

code = code.replace(premiumSection, newPremiumSection);
fs.writeFileSync('src/App.tsx', code);
console.log('patched premium shop');
