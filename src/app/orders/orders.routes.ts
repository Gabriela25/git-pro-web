import { Routes } from "@angular/router";


export const  routes: Routes = [

    {
        path:'zip-code',
        loadComponent:() => import('./zip-code/zip-code.component'),
    },
    {
        path:'phone',
        loadComponent:() => import('./phone/phone.component'),
    },
    {
        path:'description',
        loadComponent:() => import('./order-description/order-description.component'),
    },
    {
        path:'multi',
        loadComponent:() => import('./multi-form/multi-form.component'),
    }
    
]
export default routes;