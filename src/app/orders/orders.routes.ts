import { Routes } from "@angular/router";


export const  routes: Routes = [

   
    {
        path:'multi',
        loadComponent:() => import('./multi-form/multi-form.component'),
    },
    {
        path:'list',
        loadComponent:() => import('./order-list/order-list.component'),
    },
    {
        path:'detail/:id',
        loadComponent:() => import('./order-detail/order-detail.component'),
    }
    
]
export default routes;