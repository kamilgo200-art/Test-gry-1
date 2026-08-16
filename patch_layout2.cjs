const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="h-4 mt-0.5 flex items-center justify-between w-full px-2">',
  '<div className="h-3 flex items-center justify-between w-full px-2">'
);

code = code.replace(
  'maxHeight: \'380px\'',
  'maxHeight: \'400px\''
);

fs.writeFileSync('src/App.tsx', code);
