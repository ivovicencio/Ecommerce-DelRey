import { Routes } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Catalogo } from './components/catalogo/catalogo';
import { About } from './components/about/about';
import { Compra } from './components/compra/compra';
import { Admin } from './components/admin/admin';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Hero },
    { path: 'inicio', component: Hero },
    { path: 'catalogo', component: Catalogo },
    { path: 'sobre-nosotros', component: About },
    { path: 'realizar-compra', component: Compra },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'admin', component: Admin, canActivate: [adminGuard] },
    { path: '**', redirectTo: 'inicio' }
];
