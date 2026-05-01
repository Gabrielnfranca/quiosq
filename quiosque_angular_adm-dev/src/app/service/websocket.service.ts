import { Injectable, signal, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: WebSocket | null = null;
    public pedidoCount = signal<number>(0);
    private tokenService = inject(TokenService);
    private messageService = inject(MessageService);

    constructor() {
        this.connect();
    }

    connect() {
        const token = this.tokenService.getToken();
        if (!token) {
             console.log('No token found, retrying in 5 seconds...');
             setTimeout(() => this.connect(), 5000);
             return;
        }

        const wsUrl = environment.wsUrl + '/ws/pedido';
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
              const quiosque = this.tokenService.getClaim().quiosque_id;
             this.socket?.send(JSON.stringify({ quiosque }));
            console.log('Connected to WebSocket');
        };

        this.socket.onmessage = (event) => {
            console.log('New message received', event.data);
            this.messageService.add({ severity: 'info', summary: 'Novo Pedido', detail: 'Um novo pedido foi recebido!' });
            this.pedidoCount.update(count => count + 1);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from WebSocket');
            // Reconnect after 5 seconds
            setTimeout(() => this.connect(), 5000);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error', error);
        };
    }

    resetCount() {
        this.pedidoCount.set(0);
    }
}
