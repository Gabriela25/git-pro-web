import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import SingInComponent from './sing-in/sing-in.component';
import { SidebarComponent } from './sidebar/sidebar.component';



export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent

    },{
        path:'sidebar',
        component:SidebarComponent
    },{
        path:'sign-in',
        loadChildren:()=>import('./sing-in/sing-in.routes')
    }, 
    {
        path:'customer/profile',
        loadChildren:()=>import('./customer/profile/profile.routes')
    },{
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },{
        path:'**',
        redirectTo:'home',
        pathMatch:'full'
    }
];
