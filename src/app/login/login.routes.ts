import { Routes } from "@angular/router";




export const  routes: Routes = [

    {
        path:'',
        loadComponent:() => import('./login.component'),
    },
    {
        path:'register',
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
    { path: 'verify-email', loadComponent:() => import('./verify-email/verify-email.component')}

]
export default routes;