import { Routes } from '@angular/router';
import { ListItems } from './pages/list-items/list-items';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [

    //ruta por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { path: 'items', component: ListItems, canActivate: [authGuard] },

    { path: 'register', component: Register },
    
    { path: 'login', component: Login }
];
