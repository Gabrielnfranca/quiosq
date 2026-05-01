cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.ts -Raw

$content = $content.Replace(
'this.toggleSelecao(mesa.id);',
'if (mesa.id) this.toggleSelecao(mesa.id);'
)
Set-Content mesa.ts $content
