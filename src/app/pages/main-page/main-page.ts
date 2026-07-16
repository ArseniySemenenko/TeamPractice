import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet , NavigationEnd } from "@angular/router";
import { FirstLetterUpperPipe } from '../../pipes/first-letter-upper-pipe';
import { ActivatedRoute } from '@angular/router';
import { filter, map , pipe} from 'rxjs';
import {MatSidenavModule} from '@angular/material/sidenav';

type routePath = 'employees' | 'skills' | 'languages' | 'cvs';
function isRoutePath(value: string): value is routePath {
  return value === 'employees' ||
         value === 'skills' ||
         value === 'languages' ||
         value === 'cvs';
}

@Component({
  selector: 'app-main-page',
  imports: [MatSidenavModule , RouterLink, RouterLinkActive, FirstLetterUpperPipe, RouterOutlet],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage implements OnInit{

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(){

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {
      const child = this.route.firstChild;
      if (child) {
        const urlSegments = child.snapshot.url;
        const childPath = urlSegments.map(seg => seg.path).join('/');
        if (isRoutePath(childPath)) this.filter.set(childPath);
      }
    })
    
  }

  filter = signal<routePath>('employees');
}
