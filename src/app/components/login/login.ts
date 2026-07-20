import { Component , inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthInput } from 'cv-graphql';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService);

  //form signals
  email = signal<string>('admin@example.com');
  password = signal<string>('admin123');
  //is password hidden
  hidePassword = signal<boolean>(true);

  submitForm(){
    console.log('email: ' , this.email());
    console.log('password: ' , this.password());
    if(this.email() || this.password()){
      const payload: AuthInput = {
        email: this.email(),
        password: this.password(),
      };
      
      this.authService.login(payload)
      .subscribe({
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
