const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/\{nimate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \`\}/g, '{`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}`}');
code = code.replace(/\{`relative inline-flex  rounded-full h-5 w-5 border-2 border-white border-solid `\}/g, '{`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid ${mesa.status === \'chamando\' ? \'bg-red-500\' : \'bg-blue-500\'}`}');
code = code.replace(/\{`line-clamp-1  \}/g, '{`font-bold text-sm line-clamp-1 ${mesa.status === \'pronto\' ? \'text-slate-200\' : \'text-slate-700\'} ${mesa.status === \'chamando\' && \'text-red-900\'}`}');


fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
