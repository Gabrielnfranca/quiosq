const fs = require('fs');
let code = fs.readFileSync('src/pages/GarcomDashboard.tsx', 'utf8');

// Fix broken template literals from bash interpolation into double-quoted powershell string
code = code.replace(/className=\{px-4/g, "className={`px-4");
code = code.replace(/transition-all \\\}/g, "transition-all`}");
code = code.replace(/className=\{`px-4/g, "className={`px-4");
code = code.replace(/\{`\\\$/g, "{`$");
code = code.replace(/transition-all \\\}/g, "transition-all`}");
code = code.replace(/className=\{\\\n/g, "className={`\n");
code = code.replace(/\\\}/g, "`}");

fs.writeFileSync('src/pages/GarcomDashboard.tsx', code, 'utf8');
