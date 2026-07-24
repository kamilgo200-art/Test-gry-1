const fs = require('fs');
const names = [];
const prefixes = ["Cyber", "Dark", "Null", "Ghost", "Byte", "Syn", "Hex", "Neon", "Void", "Quantum", "Crypto", "Neural", "Shadow", "Rogue", "Hyper", "Alpha", "Omega", "Beta", "Zeta", "Flux", "Core", "Nexus", "Pulse", "Zen", "Tech", "Mech", "Bio", "Nano", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta"];
const suffixes = ["Worm", "Virus", "Phreak", "Root", "Bot", "Zero", "Net", "Web", "Link", "Sync", "Hack", "Crack", "Breach", "Leak", "Flow", "Wave", "Storm", "Pulse", "Surge", "Spark", "Flare", "Flash", "Burst", "Blast", "Bomb", "Nuke", "Mine", "Trap", "Snare", "Hook", "Claw", "Bite", "Sting", "Venom", "Toxin", "Poison", "Bane", "Doom", "Ruin", "Chaos", "Havoc", "Panic", "Terror", "Fear", "Dread"];

names.push("'.bat'");
names.push("'BlueScreen'");
names.push("'Wyłącz Komp'");
names.push("'Trojan'");
names.push("'DDoS'");
names.push("'Rootkit'");
names.push("'Botnet'");
names.push("'Zero-Day'");
names.push("'AI.sys'");

for(let i=10; i<=100; i++) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    names.push(`'${p}.${s}'`);
}

console.log(names.map((n, i) => `${i+1}: ${n}`).join(', '));
