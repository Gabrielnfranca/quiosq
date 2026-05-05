const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

const regex = /\<span className=\{\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \}\>\<\/span>\r?\n\s+\<span className=\{\r?\n\s+\{\`relative inline-flex rounded-full h-5 w-5 border-2 border-white \r?\nborder-solid \$\{mesa\.status === \'chamando\' \? \'bg-red-500\' : \r?\n\'bg-blue-500\'\}\`\}\>\<\/span>/g;
console.log("matches?", code.match(regex));

const toReplace = `                  <span className={\`animate-ping absolute inline-flex \r
h-full w-full rounded-full opacity-75 }>\</span>\r
                    <span className={\r
  {\`relative inline-flex rounded-full h-5 w-5 border-2 border-white \r
border-solid \${mesa.status === 'chamando' ? 'bg-red-500' : \r
'bg-blue-500'}\`}></span>`;

code = code.replace(/span className=\{\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \}\>\<\/span>\r?\n\s+\<span className=\{\r?\n\s+\{\`relative inline-flex rounded-full h-5 w-5 border-2 border-white/s, 'span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}`}></span>\n                    <span className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
