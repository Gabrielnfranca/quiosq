import { CategoriaModel } from '@/model/categoria.model';
import { CategoriaService } from '@/service/categoria.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TokenService } from '@/service/token.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { LoadingService } from '@/shared/services/loading.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    ConfirmDialogModule, 
    ButtonModule, 
    TableModule, 
    ToastModule, 
    ToolbarModule, 
    DialogModule, 
    ReactiveFormsModule, 
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RippleModule
  ],
  providers: [CategoriaService,MessageService, ConfirmationService],
  templateUrl: './categoria.html',
  styleUrl: './categoria.scss'
})
export class Categoria implements OnInit {
loadingService = inject(LoadingService);
  categoriaService = inject(CategoriaService);
  categorias = signal<CategoriaModel[]>([]);
  categoria! : CategoriaModel;
  tokenService = inject(TokenService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  formBuilder = inject(FormBuilder);
  dialogVisible = false;
  btnUpdate = false;
  form!: FormGroup;


  ngOnInit(): void {
      this.createForm();
    this.loadData();
  }

  createForm() {
        this.form = this.formBuilder.group({
            descricao: [null, [Validators.required]]
        });
    }

  loadData() {
    const claim = this.tokenService.getClaim();
    this.loadingService.show();
    this.categoriaService.findAll(claim.quiosque_id).subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.loadingService.hide();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categorias' });
        this.loadingService.hide();
      }
    });
  }

  openNew() {
    this.btnUpdate = false;
    this.dialogVisible = true;
  }

  editCategoria(categoria: CategoriaModel) {
    this.btnUpdate = true;
    this.categoria = categoria;
    this.form.patchValue(categoria);
    this.dialogVisible = true;
  }

  updateCategoria() {
    this.loadingService.show();
    this.categoria = {
      id: this.categoria.id,
      descricao: this.form.value.descricao
    }
    this.categoriaService.update(this.categoria).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria atualizada com sucesso' });
        this.loadData();
        this.hideDialog();
        this.loadingService.hide();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar categoria' });
        this.loadingService.hide();
      }
    });
  }

  deleteCategoria(categoria: CategoriaModel) { 
    this.confirmationService.confirm({
      message: 'Confirma a operação?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.loadingService.show();
        this.categoriaService.delete(categoria.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria deletada com sucesso' });
            this.loadData();
          },
          error: (e) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: e.error.message });
            this.loadingService.hide();
          }
        });
      }
    });
  } 

  saveCategoria() {
    const claim = this.tokenService.getClaim();
    this.categoria = this.form.getRawValue();
    this.loadingService.show();
    this.categoriaService.create(this.categoria,claim.quiosque_id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria salva com sucesso' });
        this.loadData();
        this.hideDialog();
        this.loadingService.hide();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar categoria' });
        this.loadingService.hide();
      }
    });
    this.form.reset();
  }

  confirmSave() {
    this.confirmationService.confirm({
      message: 'Confirma a operação?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveCategoria();
      }
    });
  }

  hideDialog() {
    this.dialogVisible = false;
  }
}
