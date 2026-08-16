const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateRegex = /const \[bitcoins, setBitcoins\] = useState<number>\(\(\) => getInitialState\('bitcoins', 0\)\);/;
code = code.replace(
  stateRegex,
  `const [bitcoins, setBitcoins] = useState<number>(() => getInitialState('bitcoins', 0));
  const [premiumAutoclickers, setPremiumAutoclickers] = useState<number>(() => getInitialState('premiumAutoclickers', 0));`
);

code = code.replace(
  "zeroDayArtifacts, bitcoins",
  "zeroDayArtifacts, bitcoins, premiumAutoclickers"
);

code = code.replace(
  "zeroDayArtifacts, bitcoins]);",
  "zeroDayArtifacts, bitcoins, premiumAutoclickers]);"
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched premium state');
