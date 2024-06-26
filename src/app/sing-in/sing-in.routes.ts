import { Routes } from "@angular/router";




export const  routes: Routes = [

    {
        path:'',
        loadComponent:() => import('./sing-in.component'),
    },
    {
        path:'register',
        loadComponent:() => import('./register/register.component')
    },
    {
        path:'password-recovery',
        loadComponent:() => import('./password-recovery/password-recovery.component')
    },
    
    {
        path:'password',
        loadComponent:() => import('./password/password.component')
    }

]
export default routes;