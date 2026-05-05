const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/nimate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \`/g, '`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
