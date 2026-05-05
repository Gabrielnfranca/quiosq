const fs = require('fs');
let code = fs.readFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', 'utf8');
const lines = code.split('\n');

const newCode = [];
for (let i = 0; i < lines.length; i++) {
   if (i === 116 || i === 117) {
      // skip corrupted lines
      continue;
   }
   if (i === 115) {
      newCode.push(lines[i]);
      newCode.push('                  <span className={nimate-ping absolute inline-flex h-full w-full rounded-full opacity-75 }></span>');
      newCode.push('                  <span className={elative inline-flex rounded-full h-5 w-5 border-2 border-white border-solid }></span>');
   } else {
      newCode.push(lines[i]);
   }
}

fs.writeFileSync('C:/SISTEMA/QuiosQ/quiosq_novo/quiosque_node-main/src/pages/GarcomDashboard.tsx', newCode.join('\n'), 'utf8');
