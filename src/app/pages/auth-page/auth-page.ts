import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, LoginArgs } from '../../services/auth-service';
import { AuthInput } from 'cv-graphql';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-page',
  imports: [FormsModule , RouterLink, RouterLinkActive, MatButtonModule , MatFormFieldModule , MatIconModule , MatInputModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {

	private readonly authService = inject(AuthService);

  hidePassword = signal<boolean>(true);
  filter = input<'login' | 'signup' | 'forgot-password'>("login");

  //form signals
  email = signal<string>('admin@example.com');
  password = signal<string>('admin@example.com');

  submitForm(){

	console.log('email: ' , this.email());
	console.log('password: ' , this.password());
    if(this.email() || this.password()){
      const payload: AuthInput = {
          email: this.email(),
          password: this.password(),
      };

	  let $authOperation;
	  switch(this.filter()){
		case 'login': 
	 		$authOperation = this.authService.login(payload);
			break;
		case 'signup':
			$authOperation = this.authService.signup(payload);
			break;
		case 'forgot-password':
			$authOperation = this.authService.forgot({email: this.email()});
			break;
	  }

	  if($authOperation) $authOperation.subscribe({
		error: (err) => {
			console.log(err);
		}
	  });
    }
  }
}
