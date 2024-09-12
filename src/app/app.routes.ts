import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProComponent } from './pro/pro.component';
import { LeadsComponent } from './pro/leads/leads.component';

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
        path:'customer/profile',
        loadChildren:()=>import('./customer/profile/profile.routes')
    },
    {
        path:'pro/become-to-pro',
        loadChildren:()=>import('./pro/become-to-pro/become-to-pro.routes')
    },
    {
        path:'pro/categories',
        component:CategoriesComponent
    },
    {
        path:'pro',
        component:ProComponent
    },
    {
        path:'pro/leads',
        component:LeadsComponent
    },
    
    {
        path:'list',
        loadChildren:()=>import('./list/list.routes')
    },
    {
        path:'phone',
    
        component:PhoneComponent
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
