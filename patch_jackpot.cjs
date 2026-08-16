const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [mergedIndex, setMergedIndex] = useState<number | null>(null);",
  "const [mergedAnim, setMergedAnim] = useState<{index: number, type: 'normal' | 'gold' | 'jackpot'} | null>(null);"
);

const mergeLogicRegex = /setMergedIndex\(targetIndex\);\s*setTimeout\(\(\) => setMergedIndex\(null\), 300\);/;
code = code.replace(mergeLogicRegex, "");

code = code.replace(
  /if \(isJackpot\) \{/g,
  `if (isJackpot) {
            setMergedAnim({ index: targetIndex, type: 'jackpot' });
            setTimeout(() => setMergedAnim(null), 1000);`
);

code = code.replace(
  /\} else if \(isGold\) \{/g,
  `} else if (isGold) {
            setMergedAnim({ index: targetIndex, type: 'gold' });
            setTimeout(() => setMergedAnim(null), 500);`
);

code = code.replace(
  /\} else \{\s*vibrate\(15\);\s*audio\.play\('merge'\);/g,
  `} else {
            setMergedAnim({ index: targetIndex, type: 'normal' });
            setTimeout(() => setMergedAnim(null), 300);
            vibrate(15);
            audio.play('merge');`
);

code = code.replace(
  /const isMerged = mergedIndex === index;/g,
  `const isMerged = mergedAnim?.index === index;
            const mergeType = isMerged ? mergedAnim.type : null;`
);

const oldClassName = "isMerged \\n                        \\? \\'scale-\\[1\\.25\\] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200\\' \\n                        : \\'idle-float transition-all duration-300\\'";
const newClassName = `isMerged 
                        ? (mergeType === 'jackpot' ? 'scale-[1.6] rotate-[360deg] blur-[2px] brightness-[3] ring-4 ring-red-500 drop-shadow-[0_0_50px_#ef4444] z-[60] transition-all duration-1000 animate-pulse'
                          : mergeType === 'gold' ? 'scale-[1.3] -rotate-12 ring-2 ring-yellow-400 drop-shadow-[0_0_30px_#eab308] z-50 transition-all duration-500'
                          : 'scale-[1.25] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200')
                        : 'idle-float transition-all duration-300'`;

code = code.replace(/isMerged \s*\?\s*'scale-\[1\.25\] brightness-200 ring-2 ring-emerald-400 z-50 transition-all duration-200' \s*:\s*'idle-float transition-all duration-300'/, newClassName);

// fix click limits
code = code.replace(
  "if (isBlocked || frustrationClicks.current.length > 45)",
  "if (isBlocked || frustrationClicks.current.length > 100)"
);
code = code.replace(
  "if (shadowbanClicks.current.length > 50 && !isShadowbanned)",
  "if (shadowbanClicks.current.length > 150 && !isShadowbanned)"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched jackpot anim and click limits');
