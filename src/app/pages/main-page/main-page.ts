import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { FirstLetterUpperPipe } from '../../pipes/first-letter-upper-pipe';
import { ActivatedRoute } from '@angular/router';
import { filter, map, pipe } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth-service';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

type routePath = 'employees' | 'skills' | 'languages' | 'cvs';
function isRoutePath(value: string): value is routePath {
    return value === 'employees' || value === 'skills' || value === 'languages' || value === 'cvs';
}

@Component({
    selector: 'app-main-page',
    imports: [
        NgClass,
        MatSidenavModule,
        RouterLink,
        RouterLinkActive,
        FirstLetterUpperPipe,
        RouterOutlet,
        MatIcon,
        MatIconModule,
    ],
    templateUrl: './main-page.html',
    styleUrl: './main-page.css',
})
export class MainPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    authService = inject(AuthService);

    fName = linkedSignal(() => {
        const user = this.authService.currentUser();
        if(user.profile){
            if (user.profile.first_name?.length) {
            if(user.profile?.first_name?.length < 8){
              return user.profile.first_name;
            }
            else{
              return user.profile.first_name?.slice(0 , 8) + "...";
            }
        }
        }
        return ""
    });

    lName = linkedSignal(() => {
        const user = this.authService.currentUser();
        if(user.profile){
            if (user.profile.last_name?.length) {
            if(user.profile?.last_name?.length < 8){
              return user.profile.last_name;
            }
            else{
              return user.profile.last_name?.slice(0 , 8) + "...";
            }
        }
        }
        return ""
    });

    ngOnInit() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            const child = this.route.firstChild;
            if (child) {
                const urlSegments = child.snapshot.url;
                const childPath = urlSegments.map((seg) => seg.path).join('/');
                if (isRoutePath(childPath)) this.filter.set(childPath);
            }
        });
    }

    filter = signal<routePath>('employees');
}
