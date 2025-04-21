import { Routes } from '@angular/router';

import { CategoriesComponent } from './pro/categories/categories.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { authGuard } from './auth.guard';



export const routes: Routes = [
    {
        path:'home',
        loadComponent:()=> import('./home/home.component')
    },
    {
        path:'auth',
        loadChildren:()=>import('./auth/auth.routes')
    }, 
    {
        path:'pro',
        loadChildren:()=>import('./pro/pro.routes'),
        canActivate: [authGuard]
    },
    {
        path:'client',
        loadChildren:()=>import('./client/client.routes'),
        canActivate: [authGuard]
    },
   
   
   

   
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },{
        path:'**',
        redirectTo:'home',
        pathMatch:'full'
    }
];
