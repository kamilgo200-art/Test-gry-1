const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = '            setZeroDayTimeLeft(prev => {';
const replacement = `            if (premiumAutoclickers > 0) {
                const autoClickGain = premiumAutoclickers * finalClickPower * secondsPassed;
                setCoins(prev => prev + autoClickGain);
                setEncryptedWallet(prev => prev + autoClickGain * 0.1);
                setStats(prev => ({ 
                    ...prev, 
                    totalClicks: prev.totalClicks + (premiumAutoclickers * secondsPassed),
                    lifetimeBits: prev.lifetimeBits + autoClickGain,
                    runBits: prev.runBits + autoClickGain
                }));
                
                if (!document.hidden && premiumAutoclickers > 0) {
                    const id = Date.now() + Math.random();
                    const btn = document.querySelector('button:has(.lucide-zap)');
                    let x = window.innerWidth / 2;
                    let y = window.innerHeight * 0.7;
                    if (btn) {
                        const rect = btn.getBoundingClientRect();
                        x = rect.left + rect.width / 2;
                        y = rect.top + rect.height / 2;
                    }
                    const tx = (Math.random() * 80 - 40);
                    setFloatingTexts(prev => [...prev, { id, text: \`+\${formatNum(finalClickPower)} x\${premiumAutoclickers}\`, x, y, tx }]);
                    setTimeout(() => {
                      setFloatingTexts(prev => prev.filter(f => f.id !== id));
                    }, 1000);
                }
            }

            setZeroDayTimeLeft(prev => {`;

code = code.replace(target, replacement);

const targetDeps = 'isPremium, overclockEndTime]);';
const replacementDeps = 'isPremium, overclockEndTime, premiumAutoclickers]);';
code = code.replace(targetDeps, replacementDeps);

fs.writeFileSync('src/App.tsx', code);
console.log('patched premium effect');
