cd C:\SISTEMA\QuiosQ\quiosq_novo\quiosque_angular_adm-dev\src\app\pages\cadastro\mesa
$content = Get-Content mesa.html -Raw
$patternToolbar = '(?s)<p-button pRipple severity="danger" label="Excluir Todas".*?/>'
$replacementToolbar = @"
<p-button pRipple severity="danger" label="Excluir Todas" icon="pi pi-trash" (click)="deleteAllMesasConfirmation()" />
            <p-toggleButton [(ngModel)]="modoExclusao" (onChange)="toggleModoExclusao()" onLabel="Modo Seleção" offLabel="Modo Seleção" onIcon="pi pi-check" offIcon="pi pi-check-circle" styleClass="p-button-warning" class="ml-2"></p-toggleButton>
            @if (modoExclusao() && mesasSelecionadas().size > 0) {
                <p-button pRipple severity="danger" label="Apagar ({{mesasSelecionadas().size}})" icon="pi pi-trash" class="ml-2" (click)="deleteSelecionadas()" />
            }
"@
$content = $content -replace $patternToolbar, $replacementToolbar

$patternCell = '(?s)<div class="flex flex-col items-center">.*?<span.*?{{ mesa\.numero }}</span>.*?<i.*?</i>.*?</div>'

$replacementCell = @"
<div class="flex flex-col items-center relative w-full h-full justify-center">
                                @if (modoExclusao()) {
                                    <div class="absolute top-1 right-1">
                                        <i class="pi pi-circle-fill text-xs" [ngClass]="mesasSelecionadas().has(mesa.id) ? 'text-red-500' : 'text-surface-300'"></i>
                                    </div>
                                }
                                <span class="font-bold text-xl mb-1 text-surface-900 dark:text-surface-0">{{ mesa.numero }}</span>
                                @if (!modoExclusao()) {
                                    <i class="pi pi-pencil text-xs text-surface-500"></i>
                                }
                            </div>
"@

$content = $content -replace $patternCell, $replacementCell

$patternCellClass = '(?s)(<div class="flex items-center justify-center bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 rounded-lg cursor-pointer transition-colors shadow-sm)'
$replacementCellClass = '$1" [ngClass]="{''ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20'': mesasSelecionadas().has(mesa.id)}"'
$content = $content -replace $patternCellClass, $replacementCellClass

Set-Content mesa.html $content
