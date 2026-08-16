const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = 'const handleBuy = () => {';
const newStr = `useEffect(() => {
    let timeout: NodeJS.Timeout;
    const scheduleNext = () => {
        const delay = 45000 + Math.random() * 45000;
        timeout = setTimeout(() => {
            const isBtc = Math.random() < 0.2;
            const id = Date.now();
            setFlyingVirus({
                id,
                top: 20 + Math.random() * 60,
                duration: 6 + Math.random() * 4,
                type: isBtc ? 'btc' : 'data'
            });
            
            setTimeout(() => {
                setFlyingVirus(prev => prev?.id === id ? null : prev);
            }, 12000);
            
            scheduleNext();
        }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  const handleVirusClick = () => {
    if (!flyingVirus) return;
    vibrate(50);
    audio.play('click');
    
    if (flyingVirus.type === 'btc') {
        setBitcoins(prev => prev + 1);
        addToast("Złapano Wirusa: +1 BITCOIN!", "gold");
    } else {
        const reward = (finalTotalIncome * 120) + 1000;
        setCoins(prev => prev + reward);
        addToast(\`Złapano Wirusa: +\${formatNum(reward)} B!\`, "normal");
    }
    
    setFlyingVirus(null);
    triggerShake('medium', 200);
  };

  const handleBuy = () => {`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/App.tsx', code);
console.log('patched virus');
