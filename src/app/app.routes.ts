import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';

export const routes: Routes = [
    {path: "auth/:filter" , component: AuthPage},
];
