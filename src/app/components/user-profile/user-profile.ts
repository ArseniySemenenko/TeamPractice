import { Component , inject, input , OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { User } from 'cv-graphql';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule , RouterLink , MatTabsModule , RouterLinkActive , RouterOutlet],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit{

  private readonly usersService = inject(UsersService);
  readonly authService = inject(AuthService);

  router = inject(Router);

  currentProfile = signal<User>({} as User);

  ngOnInit(){
    this.usersService.getUser(this.userId())
    .subscribe((res) => {
      if(res.data){
        this.currentProfile.set(res.data.user);
      }
    });  
  }


  userId = input.required<string>();
}
