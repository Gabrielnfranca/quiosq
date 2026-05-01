cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.ts -Raw

$patternImports = '(?s)import \{ CheckboxModule \} from ''primeng/checkbox'';'
$replacementImports = "import { CheckboxModule } from 'primeng/checkbox';`r`nimport { ToggleButtonModule } from 'primeng/togglebutton';"
$content = $content -replace $patternImports, $replacementImports

$patternImports2 = '(?s)(imports: \[.*?)(\])'
$replacementImports2 = "`$1, ToggleButtonModule$2"
$content = $content -replace $patternImports2, $replacementImports2

Set-Content mesa.ts $content
