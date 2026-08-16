const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "onPointerDown={handleManualAttackMouse}",
  "id=\"manual-attack-btn\"\n        onPointerDown={handleManualAttackMouse}"
);

code = code.replace(
  "document.querySelector('button:has(.lucide-zap)')",
  "document.getElementById('manual-attack-btn')"
);

fs.writeFileSync('src/App.tsx', code);
