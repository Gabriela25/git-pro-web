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
        path:'descripcion-service',
        loadComponent:() => import('./service-description/service-description.component'),
    },
    
]
export default routes;