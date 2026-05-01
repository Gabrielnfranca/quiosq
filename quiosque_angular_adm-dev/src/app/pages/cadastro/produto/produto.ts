
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Panel } from "primeng/panel";
import { Paginator } from 'primeng/paginator';
import { Select } from "primeng/select";
import { FileUploadModule } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { LoadingService } from '@/shared/services/loading.service';
import { TokenService } from '@/service/token.service';
import { ProdutoModel } from '@/model/produto.model';
import { ProdutoService } from '@/service/produto.service';
import { CategoriaService } from '@/service/categoria.service';
import { CategoriaModel } from '@/model/categoria.model';

@Component({
    selector: 'app-produto',
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
        TextareaModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TableModule,
        Paginator,
        Select,
        FileUploadModule,
        RatingModule
    ],
    providers: [MessageService, ConfirmationService, ProdutoService, CategoriaService],
    templateUrl: './produto.html',
    styleUrl: './produto.scss'
})
export class Produto implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    produtoService = inject(ProdutoService);
    categoriaService = inject(CategoriaService);

    produtoDialog: boolean = false;
    categorias = signal<CategoriaModel[]>([]);
    produtos = signal<ProdutoModel[]>([]);

    update: boolean = false;

    produto!: ProdutoModel;
    form!: FormGroup;
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    page: number = 0;
    pageSize: number = 10;

    uploadedFiles: any;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
        this.loadData();
        this.loadCategorias();
    }

    createForm() {
        this.form = this.formBuilder.group({
            nome: [null, [Validators.required]],
            descricao: [null, [Validators.required]],
            preco: [null, [Validators.required]],
            categoria: [null, [Validators.required]],
            avaliacao: [0],
            imagem: [null],
            urlImagem: [null]
        });
    }

    loadData(params?: ParamsRequest) {

        this.loadingService.show();
        const claim = this.tokenService.getClaim();
        this.produtoService.findAllPageable(params, claim.quiosque_id).subscribe({
            next: (data) => {
                this.produtos.set(data.content);
                this.totalRecords = data.totalElements;
                this.loadingService.hide();
            },
            error: (err) => {
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produtos' });
            }
        });
    }

    loadCategorias() {

        const claim = this.tokenService.getClaim();
        this.categoriaService.findAll(claim.quiosque_id).subscribe({
            next: (data) => {
                this.categorias.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categorias' });
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
        this.produto = {};
        this.submitted = false;
        this.produtoDialog = true;
        this.form.reset();
    }

    editProduto(produto: ProdutoModel) {
        this.produto = { ...produto };
        this.produtoDialog = true;
        this.form.patchValue({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            categoria: produto.categoriaDto,
            imagem: produto.imagem

        });
    }

    updateProduto() {
        this.submitted = true;
        if (this.form.valid) {

            const produtoToSave: ProdutoModel = {
                ...this.produto,
                ...this.form.value,
                categoriaId: this.form.value.categoria.id
            };
            this.produtoService.update(produtoToSave).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado', life: 3000 });
                    this.hideDialog();
                    this.loadData();
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar produto', life: 3000 });
                }
            });
        }
    }

    deleteProduto(produto: ProdutoModel) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + produto.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.produtoService.delete(produto.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto deletado', life: 3000 });
                        this.loadData();
                    },
                    error: (e) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: e.error.message, life: 3000 });
                    }
                });
            }
        });
    }

    habilitaDEsabilita(produto: ProdutoModel) {

        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja ' + (produto.ativo ? 'desabilitar' : 'habilitar') + ' ' + produto.nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {

                this.produtoService.habilitaDesabilita(produto.id, produto?.ativo ?? false).subscribe({
                    next: () => {

                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto ' + (produto.ativo ? 'desabilitado' : 'habilitado'), life: 3000 });
                        this.loadData();
                    },
                    error: (e) => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: e.error.message, life: 3000 });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.produtoDialog = false;
        this.submitted = false;
    }

    saveProduto() {
        this.submitted = true;
        debugger
        if (this.form.valid) {
            const claim = this.tokenService.getClaim();
            const produtoToSave: ProdutoModel = {
                ...this.produto,
                ...this.form.value,
                categoriaId: this.form.value.categoria.id
            };

            if (this.produto.id) {
                this.produtoService.update(produtoToSave).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado', life: 3000 });
                        this.hideDialog();
                        this.loadData();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar produto', life: 3000 });
                    }
                });
            } else {
                this.produtoService.create(produtoToSave, claim.quiosque_id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Criado', life: 3000 });
                        this.hideDialog();
                        this.loadData();
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar produto', life: 3000 });
                    }
                });
            }
        }
    }

    onUpload(event: any) {
        const file = event.files[0];
        if (file.size > 204800) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Arquivo maior que 200 KB não permitido'
            });
            return;
        }

        this.uploadedFiles = [file];

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.form.patchValue({ imagem: e.target.result.split(',')[1] }); // base64 sem prefixo
            this.produto.imagem = e.target.result.split(',')[1]; // preview
        };
        reader.readAsDataURL(file);

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

}
