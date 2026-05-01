
import { Component, inject, OnInit, signal, ViewChild, computed } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Paginator } from 'primeng/paginator';
import { Panel } from 'primeng/panel';
import { Avatar } from 'primeng/avatar';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';
import { MesaModel } from '@/model/mesa.model';
import { MesaService } from '@/service/mesa.service';
import { TokenService } from '@/service/token.service';
import { Select } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { GarcomService } from '@/service/garcom.service';

@Component({
    selector: 'app-mesa',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TableModule,
        Paginator,
        Select,
        CheckboxModule,
        ToggleButtonModule,
        Panel,
        Avatar
    ],
    providers: [MessageService, ConfirmationService, MesaService],
    templateUrl: './mesa.html',
    styleUrl: './mesa.scss'
})
export class Mesa implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    mesaService = inject(MesaService);
    garcomService = inject(GarcomService);

    mesaDialog: boolean = false;
    dropdownItems = [];

    mesas = signal<MesaModel[]>([]);
    mesa!: MesaModel;
    form!: FormGroup;
    formLote!: FormGroup;
    isLote: boolean = false;
    submitted: boolean = false;
    salvar: boolean = false;
    modoExclusao = signal<boolean>(false);
    mesasSelecionadas = signal<Set<string>>(new Set());

    tituloDialog: string = '';

    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 50;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 50;

    mesasAgrupadas = computed(() => {
        const grupos = new Map<string, MesaModel[]>();
        const arrayMesas = this.mesas() || [];
        arrayMesas.forEach(m => {
            const garcom = m.garcomNome || 'Sem Garçom Vinculado';
            if (!grupos.has(garcom)) grupos.set(garcom, []);
            grupos.get(garcom)!.push(m);
        });
        return Array.from(grupos.entries())
            .map(([garcom, mesas]) => ({ garcom, mesas }))
            .sort((a, b) => a.garcom.localeCompare(b.garcom));
    });

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.loadData();
        this.loadGarcom();
    }

    loadGarcom() {
        this.garcomService.findAllWithStatusTrue(this.tokenService.getClaim().quiosque_id).subscribe({
            next: (data) => {
                this.dropdownItems = data;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar garçons' });
            }
        });
    }

    createForm() {
        this.form = this.formBuilder.group({
            numero: [null, [Validators.required]],
            garcom: [null] // Opcional
        });
        this.formLote = this.formBuilder.group({
            numeroInicial: [null, [Validators.required]],
            numeroFinal: [null, [Validators.required]],
            garcom: [null] // Opcional
        });
    }

    loadData(params?: ParamsRequest) {
        if (!params) {
            params = {
                page: this.page,
                size: this.pageSize
            };
        }
        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.mesaService.findAllPageable(params, claim.quiosque_id).subscribe({
            next: (data) => {
                this.mesas.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: (err) => {
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar mesas' });
            }
        });
    }

    onPageChange(event: any) {
        const params: ParamsRequest = {
            page: event.first / event.rows,
            size: event.rows,
            orderBy: event.sortField,
            direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
        };
        this.loadData(params);
    }

    openNew() {
        this.salvar = true;
        this.tituloDialog = 'Cadastrar Mesa';
        this.mesa = {};
        this.submitted = false;
        this.mesaDialog = true;
        this.form.reset();
       
    }

    editMesa(mesa: MesaModel) {
        if (this.modoExclusao()) {
            if (mesa.id) this.toggleSelecao(mesa.id);
            return;
        }
        this.salvar = false;
        this.tituloDialog = 'Editar Mesa';
        this.mesa = { ...mesa };
        this.mesaDialog = true;
        this.form.patchValue({
            numero: mesa.numero,
            garcom: this.dropdownItems.find((g: any) => g.id === mesa.garcomId)
        });
        this.form.updateValueAndValidity();

      

    }

        updateMesa() {
        
        this.submitted = true;
        if (this.form.valid) {
            const mesaToUpdate: MesaModel = {
                id: this.mesa.id,
                numero: Number(this.form.value.numero),
                garcomId: this.form.value.garcom?.id || this.form.value.garcom
            };

            this.mesaService.update(mesaToUpdate).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa Atualizada', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, life: 3000 });
                }
            });
        }
    }

    onModoExclusaoChange(ativado: boolean) {
        this.modoExclusao.set(ativado);
        if (!ativado) {
            this.mesasSelecionadas.set(new Set());
        }
    }
    
    toggleSelecao(id: string) {
        const atual = new Set(this.mesasSelecionadas());
        if (atual.has(id)) {
            atual.delete(id);
        } else {
            atual.add(id);
        }
        this.mesasSelecionadas.set(atual);
    }
    
    deleteSelecionadas() {
        if (this.mesasSelecionadas().size === 0) return;
        
        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir as ${this.mesasSelecionadas().size} mesas selecionadas?`,
            header: 'Confirma��o',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.loadingService.show();
                this.mesaService.deleteBatch(Array.from(this.mesasSelecionadas())).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesas exclu�das', life: 3000 });
                        this.modoExclusao.set(false);
                        this.mesasSelecionadas.set(new Set());
                        this.loadData();
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error?.error?.message || 'Erro ao excluir mesas', life: 3000 });
                    }
                });
            }
        });
    }

    deleteAllMesasConfirmation() {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir TODAS as mesas do quiosque?',
            header: 'Aviso de Exclus�o em Massa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.loadingService.show();
                this.mesaService.deleteAll(this.tokenService.getClaim().quiosque_id).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Todas as mesas foram exclu�das', life: 3000 });
                        this.loadData();
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message || 'Erro ao excluir todas as mesas', life: 3000 });
                    }
                });
            }
        });
    }

    deleteMesa(mesa: MesaModel) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar a mesa ' + mesa.numero + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.mesaService.delete(mesa.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa deletada', life: 3000 });
                        this.loadData();
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail:  error.error.message, life: 3000 });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.mesaDialog = false;
        this.submitted = false;
        this.isLote = false;
    }

    toggleLoteMode() {
        if (this.isLote) {
            this.form.reset();
        } else {
            this.formLote.reset();
        }
    }

    saveMesa() {
        this.submitted = true;
        const claim = this.tokenService.getClaim();

        if (this.isLote) {
            if (this.formLote.invalid) return;
            
            const loteToSave = {
                numeroInicial: Number(this.formLote.value.numeroInicial),
                numeroFinal: Number(this.formLote.value.numeroFinal),
                garcomId: this.formLote.value.garcom?.id || this.formLote.value.garcom
            };

            this.mesaService.createLote(loteToSave, claim.quiosque_id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesas criadas em lote', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro ao criar lote', life: 3000 });
                }
            });

        } else {
            if (this.form.invalid) return;

            const mesaToSave: MesaModel = {
                numero: Number(this.form.value.numero),
                garcomId: this.form.value.garcom?.id || this.form.value.garcom
            };

            this.mesaService.create(mesaToSave, claim.quiosque_id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Mesa Cadastrada', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro', life: 3000 });
                }
            });
        }
    }
}












