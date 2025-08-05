import { Routes } from '@angular/router';

import { CategoriesComponent } from './pro/categories/categories.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { authGuard } from './auth.guard';
import { PaymentCancelComponent } from './payment/payment-cancel/payment-cancel.component';



export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home.component')
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes')
    },
    {
        path: 'pro',
        loadChildren: () => import('./pro/pro.routes'),
        canActivate: [authGuard]
    },
    {
        path: 'client',
        loadChildren: () => import('./client/client.routes'),
        canActivate: [authGuard]
    },
    {
        path: 'category-payment',
        loadComponent: () => import('./payments/category-payment/category-payment.component').then(m => m.CategoryPaymentComponent),
        canActivate: [authGuard]
    },
    
    {
        path: 'payment-success',
        loadComponent:()=> import('./payment/payment-success/payment-success.component').then(m=>m.PaymentSuccessComponent),
        canActivate:[authGuard]
    },
     {
        path: 'payment-cancel',
        loadComponent:()=> import('./payment/payment-cancel/payment-cancel.component').then(m=>m.PaymentCancelComponent),
        canActivate:[authGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }, {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
