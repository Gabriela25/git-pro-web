import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import SingInComponent from './sing-in/sing-in.component';


export const routes: Routes = [
    {
        path:'home',
        component: HomeComponent

    },
    
    {
        path:'sign-in',
        loadChildren:()=>import('./sing-in/sing-in.routes')
    },
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    }
    ,{
        path:'**',
        redirectTo:'home',
        pathMatch:'full'
    }
];
