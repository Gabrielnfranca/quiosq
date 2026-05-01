cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\service
$content = Get-Content mesa.service.ts -Raw

$content = $content -replace "\`\$\{\s*environment\.apiUrl\s*\}\`/\`\$\{\s*this\.urlMesaBase\s*\}/delete-batch", "`${environment.apiUrl}${this.urlMesaBase}/delete-batch"
$content = $content -replace "\\`\$\\`\{", "`${"

Set-Content mesa.service.ts $content
