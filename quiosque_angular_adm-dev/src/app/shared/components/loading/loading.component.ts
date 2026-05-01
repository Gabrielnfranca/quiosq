import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule],
    template: `
        @if (loadingService.loading()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <p-progressSpinner ariaLabel="loading" />
            </div>
        }
    `
})
export class LoadingComponent {
    loadingService = inject(LoadingService);
}
