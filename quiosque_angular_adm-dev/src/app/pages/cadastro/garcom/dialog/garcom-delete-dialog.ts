import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { GarcomService } from "@/service/garcom.service";
import { TokenService } from "@/service/token.service";
import { SelectModule } from "primeng/select";

@Component({
    selector: 'app-garcom-delete-dialog',
    standalone: true,
    imports: [Dialog, Button, ReactiveFormsModule, CommonModule, SelectModule],
    providers: [GarcomService],
    template: `
<p-dialog [visible]="garcomDelete" (visibleChange)="onVisibilityChange($event)" [style]="{ width: '450px' }" header="Deletar Garçom" [modal]="true">
    <ng-template #content>
        <form [formGroup]="form">
             <div class="flex flex-col gap-6">
                    <div>
                        <label for="state" class="block font-bold mb-3">Selecione um novo garçom para vincular a mesa!</label>
                        <p-select id="state" formControlName="garcomDestino" [options]="dropdownItems" optionLabel="nome" placeholder="Selecione um garçom" styleClass="w-full" appendTo="body" />
                    </div>
            </div>
        </form>
    </ng-template>

    <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
        <p-button label="Delete" icon="pi pi-trash" (click)="deleteGarcom()" [disabled]="form.invalid" />
    </ng-template>
</p-dialog>
    `
})
export class GarcomDeleteDialog implements OnChanges {
    dropdownItems = [];
    tokenService = inject(TokenService);
    form!: FormGroup;
    @Input() garcomDelete: boolean = false;
    @Input() garcomDeleteId!: number;
    @Output() garcomDeleteChange = new EventEmitter<any>();
     @Output() garcomDeleteEvent = new EventEmitter<any>();

    garcons: any[] = [];

    constructor(
        private garcomService: GarcomService,
        private formBuilder: FormBuilder
    ) {
        this.createForm();
    }

    createForm() {
        this.form = this.formBuilder.group({
            garcomDestino: [null, [Validators.required]]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        
        if (changes['garcomDelete'] && changes['garcomDelete'].currentValue === true) {
            const quiosqueId = this.tokenService.getClaim();
            this.garcomService.findAllNOtEqualsId(this.garcomDeleteId, quiosqueId.quiosque_id).subscribe({
                next: (response) => {
                    
                    this.dropdownItems = response;
                    this.garcomDelete = true;
                },
                error: (error) => {
                    console.error('Erro ao buscar garçons:', error);
                }
            });
        }
    }

    onVisibilityChange(value: boolean) {
        this.garcomDelete = value;
        this.garcomDeleteChange.emit(value);
    }

    hideDialog() {
        this.garcomDelete = false;
        this.garcomDeleteChange.emit(this.garcomDelete);
    }

    deleteGarcom() {
        if (this.form.valid) {
           this.garcomDeleteEvent.emit(this.form.value.garcomDestino?.id || this.form.value.garcomDestino);  
        }
    }
}