const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/span className=\{\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \}\>\<\/span>\r?\n\s+\{\`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid \$\{mesa.status === \'chamando\' \? \'bg-red-500\' \: \'bg-blue-500\'\}\`\}\>\<\/span>/g, 'span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}`}></span>\n                    <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid ${mesa.status === \'chamando\' ? \'bg-red-500\' : \'bg-blue-500\'}`}></span>');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
