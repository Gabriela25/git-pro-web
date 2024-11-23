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
        path:'lead/detail/:id',
        loadComponent:() => import('./detail-lead/detail-lead.component'),
    }
]
export default routes;