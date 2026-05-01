cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.html -Raw
$pattern = "(?s)<div class=`"grid grid-cols-1.*?>\s*<p-paginator"
$replacement = @"
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
        @for (grupo of mesasAgrupadas(); track grupo.garcom) {
            <div class="border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-sm p-4">
                <div class="flex justify-between items-center mb-4 border-b border-surface-200 dark:border-surface-700 pb-3">
                    <span class="text-xl font-bold text-primary">{{ grupo.garcom }}</span>
                    <p-tag [value]="grupo.mesas.length + ' mesas'" severity="info"></p-tag>
                </div>
                <div class="flex flex-wrap gap-3">
                    @for (mesa of grupo.mesas; track mesa.id) {
                        <div class="flex items-center justify-center bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-lg cursor-pointer transition-colors shadow-sm"
                             style="width: 4.5rem; height: 4.5rem;"
                             (click)="editMesa(mesa)">
                            <div class="flex flex-col items-center">
                                <span class="font-bold text-xl mb-1 text-surface-900 dark:text-surface-0">{{ mesa.numero }}</span>
                                <i class="pi pi-pencil text-xs text-surface-500"></i>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }
    </div>

    <p-paginator
"@
$content = $content -replace $pattern, $replacement
Set-Content mesa.html $content
