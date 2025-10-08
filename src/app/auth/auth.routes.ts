import { Routes } from "@angular/router";
import { VerifyAccountComponent } from "./verify-account/verify-account.component";
import{ NewPasswordComponent} from "./new-password/new-password.component";






export const  routes: Routes = [

    {
        path:'login',
        loadComponent:() => import('./login/login.component'),
    },
    {
        path:'sign-up',
        loadComponent:() => import('./sign-up/sign-up.component')
    },
    {
        path:'password-recovery',
        loadComponent:() => import('./password-recovery/password-recovery.component')
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