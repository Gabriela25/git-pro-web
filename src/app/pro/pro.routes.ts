import { Routes } from "@angular/router";




export const  routes: Routes = [

    {
        path:'become-to-pro',
        loadComponent:() => import('./become-to-pro/become-to-pro.component'),
    },
    
    {
        path:'basic',
        loadComponent:() => import('./basic-info/basic-info.component'),
    }
]
export default routes;