const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStyle = '.hide-scrollbar::-webkit-scrollbar { display: none; }';
const newStyle = `.hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fly-across {
            0% { left: -100px; transform: scale(0.5) rotate(-45deg); opacity: 0; }
            10% { opacity: 1; transform: scale(1.2) rotate(10deg); }
            50% { transform: scale(1) rotate(180deg) translateY(-30px); }
            90% { opacity: 1; transform: scale(1.2) rotate(340deg); }
            100% { left: 100vw; transform: scale(0.5) rotate(400deg); opacity: 0; }
        }
        .animate-fly-across {
            animation-name: fly-across;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }
        @keyframes spin-slow {
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
        }`;

code = code.replace(oldStyle, newStyle);
fs.writeFileSync('src/App.tsx', code);
console.log('patched style');
