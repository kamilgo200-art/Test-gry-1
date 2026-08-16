const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const handleManualAttackMouse = (e: React.MouseEvent) => {",
  "const handleManualAttackMouse = (e: React.PointerEvent) => {"
);

fs.writeFileSync('src/App.tsx', code);
