const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = 'const passiveIncomeMultiplier = 1';
const newStr = `const bitcoinBonus = (bitcoins || 0) * 0.05;
  const passiveIncomeMultiplier = 1`;

code = code.replace(oldStr, newStr);

code = code.replace(
  "+ ((upgrades.cyberDysonSphere || 0) * 500);",
  "+ ((upgrades.cyberDysonSphere || 0) * 500)\n    + bitcoinBonus;"
);

code = code.replace(
  "zeroDayArtifacts\n    });",
  "zeroDayArtifacts, bitcoins\n    });"
);

code = code.replace(
  "zeroDayArtifacts]);",
  "zeroDayArtifacts, bitcoins]);"
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched multipliers');
