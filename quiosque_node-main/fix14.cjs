const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

const errorBlock = `                  <span className={\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 }\\></span>\n                    <span className={\n  {\`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid \${mesa.status === 'chamando' ? 'bg-red-500' : 'bg-blue-500'}\`}></span>`;

const correctBlock = `                  <span className={\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \${mesa.status === 'chamando' ? 'bg-red-400' : 'bg-blue-400'}\`}></span>\n                    <span className={\`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid \${mesa.status === 'chamando' ? 'bg-red-500' : 'bg-blue-500'}\`}></span>`;

code = code.replace(errorBlock, correctBlock);
code = code.replace(/\}\>\<\/span>\r?\n\s+\<span className=\{\r?\n\s+\{\`relative/g, '\${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}\`}></span>\n                    <span className={`relative');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
