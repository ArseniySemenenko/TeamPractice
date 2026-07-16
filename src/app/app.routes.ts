import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { MainPage } from './pages/main-page/main-page';
import { EmployeesList } from './components/employees-list/employees-list';
import { SkillsList } from './components/skills-list/skills-list';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Forgot } from './components/forgot/forgot';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: "" , redirectTo: "main/employees", pathMatch: 'full'},
    {path: "main" , redirectTo: "main/employees" , pathMatch: 'full'},

    {path: "auth" , component: AuthPage,
        children:[
            {path: 'login' , component: Login},
            {path: 'signup' , component: Signup},
        ]
    },
    {path: 'forgot-password' , component: Forgot},

    {path: "main" , component: MainPage, 
        children:[
            {path: 'employees' , component: EmployeesList},
            {path: 'skills' , component: SkillsList},
        ],
        
        canActivate: [authGuard]
    },
];
