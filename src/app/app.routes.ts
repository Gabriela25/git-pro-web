import { Routes } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { CategoriesComponent } from './pro/categories/categories.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';



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
        loadChildren:()=>import('./pro/pro.routes')
    },
    {
        path:'orders',
        loadChildren:()=>import('./orders/orders.routes')
    },
    {
        path:'sidebar',
        component:SidebarComponent
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
