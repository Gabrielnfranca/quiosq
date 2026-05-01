cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.ts -Raw
$pattern = "(?s)    , ToggleButtonModule,\s*providers: \[MessageService, ConfirmationService, MesaService\],\s*templateUrl: '\./mesa.html',\s*styleUrl: '\./mesa.scss'\s*\})"
$replacement = @"
        ToggleButtonModule
    ],
    providers: [MessageService, ConfirmationService, MesaService],
    templateUrl: './mesa.html',
    styleUrl: './mesa.scss'
})
"@
$content = $content -replace $pattern, $replacement
Set-Content mesa.ts $content
