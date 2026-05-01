import { Routes } from '@angular/router';
import { Garcom } from './garcom/garcom';
import { Mesa } from './mesa/mesa';
import { Produto } from './produto/produto';
import { Categoria } from './categoria/categoria';
import { adminGuard } from '../../guards/admin.guard';

export default [
    { path: 'garcom', data: { breadcrumb: 'Garcom' }, component: Garcom, canActivate: [adminGuard] },
    { path: 'mesa', data: { breadcrumb: 'Mesa' }, component: Mesa, canActivate: [adminGuard] },
    { path: 'produto', data: { breadcrumb: 'Produto' }, component: Produto, canActivate: [adminGuard] },
    { path: 'categoria', data: { breadcrumb: 'Categoria' }, component: Categoria, canActivate: [adminGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
