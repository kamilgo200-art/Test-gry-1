const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const handleManualAttack = (e: React.MouseEvent) => {",
  "const handleManualAttack = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {"
);

code = code.replace(
  "onClick={handleManualAttack}",
  "onPointerDown={handleManualAttack}"
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched multi-touch');
