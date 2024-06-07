import { Routes } from "@angular/router";




export const  routes: Routes = [

    {
        path:'',
        loadComponent:() => import('./profile.component'),
    },
    {
        path:'address',
        loadComponent:() => import('./address/address.component'),
    }
    
]
export default routes;