import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';


import { PhoneComponent } from './phone/phone.component';
import { CategoriesComponent } from './pro/categories/categories.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';



export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent

    },{
        path:'sidebar',
        component:SidebarComponent
    },{
        path:'auth',
        loadChildren:()=>import('./auth/auth.routes')
    }, 
   
    {
        path:'pro',
        loadChildren:()=>import('./pro/pro.routes')
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
