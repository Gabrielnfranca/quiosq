cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.html -Raw

$content = $content.Replace(
'}""',
'}"'
)
Set-Content mesa.html $content
