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

  error = signal("");

  isSubmitDisabled = signal(false);

  //form signals
  email = signal<string>('for.my.unity65@gmail.com');
  password = signal<string>('admin123');
  //is password hidden
  hidePassword = signal<boolean>(true);

  submitForm(){
    this.isSubmitDisabled.set(true);

    if(this.email() == "" || this.password() == ""){
      this.error.set('Password or Email cant be empty');
      return;
    }

    if(!this.email().includes("@") || !this.email().includes(".")){
      this.error.set('Email not provided');
      return;
    }

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
          this.isSubmitDisabled.set(false);
          if(err.message == "Invalid credentials"){
            this.error.set("Wrong email or password");
          }
        }
      });
    }
  }
}
