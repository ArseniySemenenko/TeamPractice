import { Component , inject, input } from '@angular/core';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

  private readonly usersService = inject(UsersService);

  

  userId = input.required();
}
