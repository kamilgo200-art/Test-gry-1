const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const attackRegex = /const handleManualAttack = \(e: React\.MouseEvent \| React\.PointerEvent \| React\.TouchEvent\) => \{[\s\S]*?const id = floatingIdCounter\.current\+\+;/;

code = code.replace(
  attackRegex,
  `const executeAttack = () => {
    reportAction();
    vibrate(15);
    audio.play('click');
    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t <= 3000);
    
    shadowbanClicks.current.push(now);
    shadowbanClicks.current = shadowbanClicks.current.filter(t => now - t <= 1000);
    if (shadowbanClicks.current.length > 150 && !isShadowbanned) {
        setIsShadowbanned(true);
    }
    
    registerClick(false);
    if (clickTimestamps.current.length >= 20 && !isOverdrive) {
        setIsOverdrive(true);
        vibrate([50, 50, 100, 50, 200]);
        triggerShake('extreme', 8000);
        setRootMessage("PRZEŁADOWANIE BUFORA!!!");
        if (overdriveTimeoutRef.current) clearTimeout(overdriveTimeoutRef.current);
        overdriveTimeoutRef.current = setTimeout(() => {
            setIsOverdrive(false);
            setShakeLevel('none');
            setRootMessage("System schłodzony.");
            clickTimestamps.current = [];
        }, 8000);
    }
    setCoins(prev => prev + finalClickPower);
    setEncryptedWallet(prev => prev + finalClickPower * 0.1);
    
    manualClickCountRef.current += 1;
    if (manualClickCountRef.current >= 10) {
        setSeasonScripts(prev => prev + 1);
        manualClickCountRef.current = 0;
    }
    
    if (isZeroDayActive && Math.random() < 0.1) {
        setZeroDayKeys(prev => prev + 1);
    }
    
    setStats(prev => ({ 
        ...prev, 
        totalClicks: prev.totalClicks + 1,
        lifetimeBits: prev.lifetimeBits + finalClickPower,
        runBits: prev.runBits + finalClickPower
    }));
  };

  const handleManualAttackMouse = (e: React.MouseEvent) => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    executeAttack();
    const id = floatingIdCounter.current++;`
);

code = code.replace(
  "onPointerDown={handleManualAttack}",
  "onPointerDown={handleManualAttackMouse}"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched multi touch better');
