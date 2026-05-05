const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');

code = code.replace(/\{nimate-ping(.*?)\`\}/g, '{`animate-ping $1\`}');
code = code.replace(/elative inline-flex(.*?)\`\}/g, '{`relative inline-flex $1\`}');
code = code.replace(/className=\{elative/g, 'className={`relative');

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', code, 'utf8');
