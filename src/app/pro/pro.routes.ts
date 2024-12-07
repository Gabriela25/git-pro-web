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
        path:'get-leads',
        loadComponent:() => import('./get-leads/get-leads.component'),
    },
    {
        path:'get-orders',
        loadComponent:() => import('./get-orders/get-orders.component'),
    },
    {
        path:'order/detail/:id',
        loadComponent:() => import('./detail-order/detail-order.component'),
    }
]
export default routes;