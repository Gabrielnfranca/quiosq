
import { Component, DebugNode, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CpfValidator } from '@/shared/validators/cpf.validator';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/pages/service/product.service';
import { NgxMaskDirective } from 'ngx-mask';
import { Panel } from "primeng/panel";
import { Avatar } from "primeng/avatar";
import { GarcomService } from '@/service/garcom.service';
import { GarcomModel } from '@/model/garcom.model';
import { TokenService } from '@/service/token.service';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';
import { GarcomDeleteDialog } from "./dialog/garcom-delete-dialog";
import { debounceTime } from 'rxjs';


@Component({
    selector: 'app-garcom',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TableModule,
        NgxMaskDirective,
        Panel,
        Avatar,
        Paginator,
        GarcomDeleteDialog
    ],
    providers: [MessageService, ProductService, ConfirmationService],
    templateUrl: './garcom.html',
    styleUrl: './garcom.scss'
})
export class Garcom implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    garcomDialog: boolean = false;
    garcomDelete: boolean = false;
    garcomEdit: boolean = false;
    garcomDeleteId: number = 0;

    products = signal<Product[]>([]);
    garcons = signal<GarcomModel[]>([]);

    garcom!: GarcomModel;

    form!: FormGroup;
    formSearch!: FormGroup;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;


    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private garcomService: GarcomService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createSearchForm();
        this.createForm();
        this.formSearch
            .get('search')
            ?.valueChanges.pipe(debounceTime(1000))
            .subscribe((valor) => {
                this.loadData({ search: valor });
            });

        this.loadData();
    }

    createForm() {
        this.form = this.formBuilder.group({
            id: [null],
            nome: [null, [Validators.required]],
            cpf: [null, [Validators.required, CpfValidator.validate]],
            status: [true]
        });
    }
     createSearchForm() {
        this.formSearch = this.formBuilder.group({
            search: [null]
        });
    }
    clearSearch() {
        this.formSearch.get('search')?.setValue(null);
       
    }

    loadData(param?: ParamsRequest) {
        
        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.garcomService.findAllPageable(param, claim.quiosque_id).subscribe({
            next: (data) => {
                this.garcons.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: () => {
                this.loadingService.hide();
            }
        });
    }


    onPageChange(event: PaginatorState) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;
        this.page = event.page ?? 0;
        
        this.loadData({ page: this.page });

    }

    openNew() {
        this.garcom = {};
        this.submitted = false;
        this.garcomDialog = true;
    }

    editGarcom(garcom: GarcomModel) {
        this.form.patchValue(garcom);
        this.garcomEdit = true;
    }


    deleteSelectedGarcons(garcomId: number) {
        this.garcomDeleteId = garcomId;
        this.garcomDelete = true;
    }

    hideDialog() {
        this.garcomDialog = false;
        this.submitted = false;
    }

    hideEditDialog() {
        this.garcomEdit = false;
        this.submitted = false;
    }

    deleteGarcom(garcom: any) {
        
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o garçom? <br>Todas as mesas serão desassociadas e adicionadas ao garçom selecionado!',
            header: 'Confirmar Exclusão',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loadingService.show();
                this.garcomDelete = false;
                const claim = this.tokenService.getClaim();
                this.garcomService.delete(claim.quiosque_id, this.garcomDeleteId, garcom).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        
                        this.loadData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Garcom excluído com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    activateGarcom(garcom: GarcomModel) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja ativar o garçom?',
            header: 'Confirmar Ativação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loadingService.show();
                this.garcomService.activate(garcom.id).subscribe({
                    next: () => {
                        this.loadingService.hide();
                        
                        this.loadData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Garcom ativado com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        this.loadingService.hide();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }




    saveGarcom() {
        
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.garcom = {
            ...this.form.value
        };
        const claim = this.tokenService.getClaim();
        this.loadingService.show();
        this.garcomService.create(this.garcom, claim.quiosque_id).subscribe({
            next: () => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Garcom salvo com sucesso',
                    life: 3000
                });
                
                this.loadData();
                this.hideDialog();
                this.form.reset();
            },
            error: (error) => {
                this.loadingService.hide();
                const errorMessage = typeof error.error === 'string' ? error.error : error.error?.message || '';
                if (errorMessage.toLowerCase().includes('cpf')) {
                    this.form.get('cpf')?.setErrors({ 'cpfExists': true });
                }
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage || 'Falha na comunicação com o servidor',
                    life: 3000
                });
            }
        });

        
    }

    editarGarcom(garcom: GarcomModel) {
        this.garcomEdit = false;
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.garcom = {
            ...this.form.value,
            ...garcom
        };

        this.loadingService.show();
        this.garcomService.update(this.garcom).subscribe({
            next: () => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Garcom editado com sucesso',
                    life: 3000
                });
                
                this.loadData();
                this.hideDialog();
            },
            error: (error) => {
                this.loadingService.hide();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                    life: 3000
                });
            }
        });
    }


    getSeverity(status: boolean) {
        return status ? 'success' : 'danger';
    }

    getStatusName(status: boolean) {
        return status ? 'Ativo' : 'Inativo';
    }
}