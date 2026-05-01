import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PedidoModel } from '@/model/pedido.model';
import { PedidoService } from '@/service/pedido.service';
import { TokenService } from '@/service/token.service';
import { LoadingService } from '@/shared/services/loading.service';
import { ParamsRequest } from '@/shared/utils/pageable.utils';
import { PhonePipe } from '@/shared/pipes/phone.pipe';
import { TimeElapsedPipe } from '@/shared/pipes/time-elapsed.pipe';
import { Paginator } from "primeng/paginator";
import { SelectButtonModule } from 'primeng/selectbutton';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    RippleModule,
    PhonePipe,
    Paginator,
    ReactiveFormsModule,
    SelectButtonModule,
    TimeElapsedPipe
],
    providers: [MessageService, PedidoService],
    templateUrl: './pedidos.html'
})
export class Pedidos implements OnInit {
    loadingService = inject(LoadingService);
    tokenService = inject(TokenService);
    pedidoService = inject(PedidoService);
    messageService = inject(MessageService);
    formBuilder = inject(FormBuilder);

    pedidos = signal<PedidoModel[]>([]);
    totalRecords: number = 0;
    loading = signal<boolean>(false);
    
    now = signal<Date>(new Date());
    private intervalId: any;

    @ViewChild('dt') dt!: Table;

    first: number = 0;
    rows: number = 10;
    page: number = 0;
    pageSize: number = 10;
    form!: FormGroup;
    statusOptions = [
        { label: 'Aguardando Pagamento', value: 'pending' },
        { label: 'Aguardando Preparo', value: 'awaiting_preparation' },
        { label: 'Em Preparação', value: 'preparing' },
        { label: 'Pronto', value: 'ready' },
        { label: 'Em Entrega', value: 'delivering' },
        { label: 'Entregue', value: 'completed' },
        { label: 'Cancelado', value: 'cancelled' }
    ];

    ngOnInit() {
        
        this.createForm();
        this.form
            .get('search')
            ?.valueChanges.pipe(debounceTime(1000))
            .subscribe((valor) => {
                this.loadData({ search: valor });
            });
        
        this.loadData();
        
        this.intervalId = setInterval(() => {
            this.now.set(new Date());
        }, 1000);
    }
    
    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    createForm() {
        this.form = this.formBuilder.group({
            search: [null],
            status: [null]
        });
    }

    clearSearch() {
        this.form.get('search')?.setValue(null);
       
    }

    loadData(params?: ParamsRequest) {
        this.loading.set(true);
        const claim = this.tokenService.getClaim();
    
        this.pedidoService.findAllPageable(params, claim.quiosque_id).subscribe({

            next: (data) => {

                this.pedidos.set(data.content);
                this.totalRecords = data.totalElements;
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos' });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

    getSeverity(status: string) {
        switch (status) {
            case 'completed':
            case 'ready':
            case 'delivering':
                return 'success';
            case 'preparing':
            case 'awaiting_preparation':
                return 'info';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'warning';
        }
    }

     updateStatus(pedido: PedidoModel, status: string) {
        if (!pedido.id) return;

        this.pedidoService.updateStatus(pedido.id, status).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Status atualizado com sucesso' });
                this.loadData();
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar status' });
            }
        });
    }

    returnStatus(status: string) {
        switch (status) {
            case 'pending':
                return 'Aguardando Pagamento';
            case 'awaiting_preparation':
                return 'Aguardando Preparo';
            case 'preparing':
                return 'Em Preparação';
            case 'ready':
                return 'Pronto';
            case 'delivering':
                return 'Em Entrega';
            case 'completed':
                return 'Entregue';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    }

}
