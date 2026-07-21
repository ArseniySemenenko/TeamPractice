import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth-page/auth-page';
import { MainPage } from './pages/main-page/main-page';
import { EmployeesList } from './components/employees-list/employees-list';
import { SkillsList } from './components/skills-list/skills-list';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Forgot } from './components/forgot/forgot';
import { authGuard } from './guards/auth-guard';
import { mainGuard } from './guards/main-guard';
import { UserProfile } from './components/user-profile/user-profile';

export const routes: Routes = [
    {path: "" , redirectTo: "main/employees", pathMatch: 'full'},
    {path: "main" , redirectTo: "main/employees" , pathMatch: 'full'},

    {path: "auth" , component: AuthPage,
        children:[
            {path: 'login' , component: Login},
            {path: 'signup' , component: Signup},
        ],
        canActivate: [authGuard],
    },
    {path: 'forgot-password' , component: Forgot},

    {path: "" , component: MainPage, 
        children:[
            {path: 'users' , component: EmployeesList},
            {path: 'users/:userId/profile' , component: UserProfile},
            {path: 'skills' , component: SkillsList},
        ],
        
        canActivate: [mainGuard],
    },
];
