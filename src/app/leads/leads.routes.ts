import { Routes } from "@angular/router";


export const  routes: Routes = [

   
    {
        path:'multi',
        loadComponent:() => import('./multi-form/multi-form.component'),
    },
    {
        path:'list',
        loadComponent:() => import('./lead-list/lead-list.component'),
    },
    {
        path:'detail/:id',
        loadComponent:() => import('./lead-detail/lead-detail.component'),
    }
    
]
export default routes;