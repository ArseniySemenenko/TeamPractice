import { Component , inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthInput } from 'cv-graphql';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-signup',
  imports: [ FormsModule ,MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterLink, MatError],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly authService = inject(AuthService);

  error = signal("");

  //form signals
  email = signal<string>('');
  password = signal<string>('');
  //is password hidden
  hidePassword = signal<boolean>(true);

  submitForm(){

    if(this.email() == "" || this.password() == ""){
      this.error.set('Password or Email cant be empty');
      return;
    }

    console.log('email: ' , this.email());
    console.log('password: ' , this.password());
    if(this.email() || this.password()){
      const payload: AuthInput = {
        email: this.email(),
        password: this.password(),
      };
      
      this.authService.signup(payload)
      .subscribe({
        error: (err) => {
          this.error.set(err.message);
        }
      });
    }
  }
}
