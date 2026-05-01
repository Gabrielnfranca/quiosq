cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.html -Raw

$content = $content.Replace(
'mesa.id && mesasSelecionadas().has(mesa.id)',
'mesa.id && mesasSelecionadas().has($any(mesa.id))'
)
$content = $content.Replace(
'mesasSelecionadas().has(mesa.id)',
'mesasSelecionadas().has($any(mesa.id))'
)

Set-Content mesa.html $content
