const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/className=\{\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \}\>\<\/span>/g, 'className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}`}></span>');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
