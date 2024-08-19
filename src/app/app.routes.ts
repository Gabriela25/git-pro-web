import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProComponent } from './pro/pro.component';
import { LeadsComponent } from './pro/leads/leads.component';
import AddressComponent from './pro/profile/address/address.component';
import { PhoneComponent } from './phone/phone.component';
import { CategoriesComponent } from './pro/categories/categories.component';



export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent

    },{
        path:'sidebar',
        component:SidebarComponent
    },{
        path:'sign-in',
        loadChildren:()=>import('./sign-in/sign-in.routes')
    }, 
    {
        path:'customer/profile',
        loadChildren:()=>import('./customer/profile/profile.routes')
    },
    {
        path:'pro/profile',
        loadChildren:()=>import('./pro/profile/profile.routes')
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
        path:'pro/direction',
        component:AddressComponent
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
