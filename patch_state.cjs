const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateRegex = /const \[coins, setCoins\] = useState<number>\(\(\) => getInitialState\('coins', 0\)\);/;
code = code.replace(
  stateRegex,
  `const [coins, setCoins] = useState<number>(() => getInitialState('coins', 0));
  const [bitcoins, setBitcoins] = useState<number>(() => getInitialState('bitcoins', 0));
  const [flyingVirus, setFlyingVirus] = useState<{id: number, top: number, duration: number, type: 'data' | 'btc'} | null>(null);`
);

fs.writeFileSync('src/App.tsx', code);
console.log('patched state');
