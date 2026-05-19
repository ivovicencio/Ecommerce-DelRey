import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/hero/hero').then(m => m.Hero) },
    { path: 'inicio', loadComponent: () => import('./components/hero/hero').then(m => m.Hero) },
    { path: 'catalogo', loadComponent: () => import('./components/catalogo/catalogo').then(m => m.Catalogo) },
    { path: 'sobre-nosotros', loadComponent: () => import('./components/about/about').then(m => m.About) },
    { path: 'realizar-compra', loadComponent: () => import('./components/compra/compra').then(m => m.Compra) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register), canActivate: [adminGuard] },
    { path: 'admin', loadComponent: () => import('./components/admin/admin').then(m => m.Admin), canActivate: [adminGuard] },
    { path: '**', redirectTo: 'inicio' }
];
