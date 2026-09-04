const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "if (tutorialStep === 0 && coins >= scriptCost) setTutorialStep(1);";
const replacement = "if (stats.totalClicks > 50 && tutorialStep < 5) setTutorialStep(5);\n     else if (tutorialStep === 0 && coins >= scriptCost) setTutorialStep(1);";

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('patched tutorial skip');
