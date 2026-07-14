import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { MainPage } from './pages/main-page/main-page';

export const routes: Routes = [
    {path: "auth/:filter" , component: AuthPage},
    {path: "" , redirectTo: "main/employees", pathMatch: 'full'},
    {path: "main" , redirectTo: "main/employees" , pathMatch: 'full'},
    {path: "main/:filter" , component: MainPage},
];
