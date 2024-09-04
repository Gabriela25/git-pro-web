import { Routes } from "@angular/router";
import { VerifyAccountComponent } from "./verify-account/verify-account.component";
import { NewPasswordComponent } from "./new-password/new-password.component";




export const  routes: Routes = [

    {
        path:'',
        loadComponent:() => import('./auth.component'),
    },
    {
        path:'sign-in',
        loadComponent:() => import('./sign-in/sign-in.component')
    },
    {
        path:'password-recovery',
        loadComponent:() => import('./password-recovery/password-recovery.component')
    },
    
    {
        path:'password',
        loadComponent:() => import('./password/password.component')
    },
    { path: 'verify-email', loadComponent:() => import('./verify-email/verify-email.component')},
    {
        path:'verify/:id',
        component:VerifyAccountComponent
    }, 
    {
        path:'reset/:id',
        component:NewPasswordComponent
    }, 

]
export default routes;