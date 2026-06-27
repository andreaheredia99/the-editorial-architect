import { Routes } from '@angular/router';
import { ListItems } from './pages/list-items/list-items';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { CreateEditItem } from './pages/create-edit-item/create-edit-item';
import { DetailItem } from './pages/detail-item/detail-item';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { NotFound } from './pages/not-found/not-found';
import { Admin } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';


export const routes: Routes = [

    //ruta por defecto
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    { path: 'items', component: ListItems},

    { path: 'register', component: Register },
    
    { path: 'login', component: Login },

    { path: 'create-item', component: CreateEditItem, canActivate: [authGuard] },

    { path: 'edit-item/:id', component: CreateEditItem, canActivate: [authGuard] },

    { path: 'detail-item/:id', component: DetailItem },
    
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    
    { path: 'profile', component: Profile, canActivate: [authGuard] },

    { path: 'admin', component: Admin, canActivate: [adminGuard] },
    
    // pagina 404
    { path: '**', component: NotFound},
];
