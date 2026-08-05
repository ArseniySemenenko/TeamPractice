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
import { LangsList } from './components/langs-list/langs-list';
import { ProfileDetails } from './components/profile-details/profile-details';
import { CvsList } from './components/cvs-list/cvs-list';
import { CvDetails } from './components/cv-details/cv-details';
import { CvProfile } from './components/cv-profile/cv-profile';
import { CvSkills } from './components/cv-skills/cv-skills';
import { CvProjects } from './components/cv-projects/cv-projects';
import { CvPreview } from './components/cv-preview/cv-preview';
import { VerifyMail } from './components/verify-mail/verify-mail';
import { ResetPassword } from './components/reset-password/reset-password';

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
//http://localhost:4200/verify-email
    {path: 'forgot-password' , component: Forgot, canActivate: [authGuard]},

    {path: 'verify-email' , component: VerifyMail},

    {path: 'reset-password' , component: ResetPassword},

    {path: "" , component: MainPage, 
        children:[
            {path: 'users' , component: EmployeesList},
            {path: 'users/:userId' , component: UserProfile ,
                children: [
                    {path: '', redirectTo: 'profile', pathMatch: 'full'},
                    {path: 'profile' , component: ProfileDetails},
                    {path: 'skills' , component: SkillsList},
                    {path: 'languages' , component: LangsList},
            ]},
            {path: 'skills' , component: SkillsList},
            {path: 'languages' , component: LangsList},
            {path: 'cvs' , component: CvsList},
            {path: 'cvs/:cvId' , component: CvDetails,
                children: [
                    {path: '' , redirectTo: 'details', pathMatch: 'full'},
                    {path: 'details' , component: CvProfile},
                    {path: 'skills' , component: CvSkills},
                    {path: 'projects' , component: CvProjects},
                    {path: 'preview' , component: CvPreview},
                ]
            },
        ],
        
        canActivate: [mainGuard],
    },
];
