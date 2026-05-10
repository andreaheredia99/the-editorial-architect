import { Routes } from '@angular/router';
import { ListItems } from './pages/list-items/list-items';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { CreateEditItem } from './pages/create-edit-item/create-edit-item';


export const routes: Routes = [

    //ruta por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { path: 'items', component: ListItems, canActivate: [authGuard] },

    { path: 'register', component: Register },
    
    { path: 'login', component: Login },

    { path: 'create-item', component: CreateEditItem },

    { path: 'edit-item/:id', component: CreateEditItem }
];
