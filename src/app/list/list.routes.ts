import { Routes } from "@angular/router";
import { ListComponent } from "./list.component";




export const  routes: Routes = [

    {
        path:'',
        component:ListComponent
    },
    {
        path:'electrical',
        loadComponent:() => import('./electrical/electrical.component')
    },
    
]
export default routes;