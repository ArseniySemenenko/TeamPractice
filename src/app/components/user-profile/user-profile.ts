import { Component , inject, input , OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { User } from 'cv-graphql';
@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule , RouterLink , MatTabsModule , RouterLinkActive , RouterOutlet],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit{

  private readonly usersService = inject(UsersService);

  currentProfile = signal<User>({} as User);

  ngOnInit(){
    this.usersService.getUser(this.userId())
    .subscribe((res) => {
      if(res.data){
        this.currentProfile.set(res.data.user);
      }
    });  
  }


  userId = input.required<number>();
}
