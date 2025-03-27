import { Routes } from "@angular/router";




export const  routes: Routes = [

    {
        path:'become-to-pro',
        loadComponent:() => import('./become-to-pro/become-to-pro.component'),
    },
    
    {
        path:'basic',
        loadComponent:() => import('./basic-info/basic-info.component'),
    },
    {
        path:'payments',
        loadComponent:() => import('./payments/payments.component'),
    },
    {
        path:'leads',
        loadComponent:() => import('./leads/leads.component'),
    },
    {
        path:'orders',
        loadComponent:() => import('./orders/orders.component'),
    },
    {
        path:'orders/detail/:id',
        loadComponent:() => import('./order-detail/order-detail.component'),
    }
]
export default routes;