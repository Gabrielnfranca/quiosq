import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './app/shared/components/loading/loading.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, LoadingComponent],
    template: `
        <app-loading />
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}
