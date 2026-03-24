import { Routes } from '@angular/router';
import { Hero } from './components/hero/hero';
import { Catalogo } from './components/catalogo/catalogo';
import { About } from './components/about/about';
import { Compra } from './components/compra/compra';
export const routes: Routes = [
    { path: '', component: Hero },
    {path: 'inicio', component: Hero },
    { path: 'catalogo', component: Catalogo },
    { path: 'sobre-nosotros', component: About },
    { path: 'realizar-compra', component: Compra },
    { path: '**', redirectTo: 'inicio' }
];

