import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { TokenService } from '@/service/token.service';
import { WebSocketService } from '@/service/websocket.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadge } from "primeng/overlaybadge";
import { Toast } from "primeng/toast";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, MenuModule, BadgeModule, OverlayBadge, Toast],
    template: ` 
     <p-toast></p-toast>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed h-8 w-8">
                    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"></path>
                    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"></path>
                    <path d="m2.1 21.8 6.4-6.3"></path>
                    <path d="m19 5-7 7"></path>
               </svg>
                <span>Quiosq - Admin</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button *ngIf="webSocketService.pedidoCount() > 0" type="button" class="layout-topbar-action" (click)="resetMessages()">
                        <p-overlaybadge  [value]="webSocketService.pedidoCount()">
                            <i class="pi pi-bell" style="font-size: 2rem"></i>
                        </p-overlaybadge>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <p-menu #menu [model]="items" [popup]="true" appendTo="body"></p-menu>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    private tokenService = inject(TokenService);
    private router = inject(Router);
    public webSocketService = inject(WebSocketService);

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.items = [
            {
                label: 'Sair',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.tokenService.clearToken();
                    this.router.navigate(['/auth/login']);
                }
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    resetMessages() {
        this.webSocketService.resetCount();
        this.router.navigate(['/pedidos'], { queryParamsHandling: 'merge' });

    }
}
