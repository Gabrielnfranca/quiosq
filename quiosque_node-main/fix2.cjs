const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/className=\{\n                  relative p-4 sm:p-5 rounded-2xl flex flex-col items-start text-left transition-transform active:scale-95 border-2\n                  \\/g, 'className={`\n                  relative p-4 sm:p-5 rounded-2xl flex flex-col items-start text-left transition-transform active:scale-95 border-2\n                  $');

code = code.replace(/\\}\n            >/g, '`}\n            >');
code = code.replace(/\\\$/g, '$');
code = code.replace(/className=\{`\\/g, 'className={`\n');
code = code.replace(/opacity-75 \\/g, 'opacity-75 $');
code = code.replace(/border-solid \\/g, 'border-solid $');
code = code.replace(/line-clamp-1 \\/g, 'line-clamp-1 $');
code = code.replace(/font-semibold \\/g, 'font-semibold $');


fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
