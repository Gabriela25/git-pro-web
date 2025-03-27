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
    ,
    {
        path:'orders',
        loadComponent:() => import('./orders/orders.component'),
    }
    ,
    {
        path:'orders/order/detail/:id',
        loadComponent:() => import('./order-detail/order-detail.component'),
    }
    
]
export default routes;