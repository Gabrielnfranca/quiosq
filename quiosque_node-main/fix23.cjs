const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

const regex = /\<span className=\{\`animate-ping.*?\}\>\<\/span>\r?\n\s+\<span className=\{\r?\n\s+\{\`relative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid/gs;
console.log("matches?", code.match(regex));

const simplerRegex = /span className=\{\`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 \}\>\<\/span>\r?\n\s+\<span className=\{\r?\n\s+\{\`relative inline-flex/sg;
console.log("simpler matches?", code.match(simplerRegex));

code = code.replace(simplerRegex, 'span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mesa.status === \'chamando\' ? \'bg-red-400\' : \'bg-blue-400\'}`}></span>\n                    <span className={`relative inline-flex');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
