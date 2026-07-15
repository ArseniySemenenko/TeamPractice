import { Component , inject, signal } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot',
  imports: [MatFormField , MatLabel , FormsModule , RouterLink , MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css',
})
export class Forgot {

    private readonly authService = inject(AuthService);

    email = signal<string>('');

    submitForm(){
    console.log('email: ' , this.email());
    if(this.email()){
      this.authService.forgot({email: this.email()})
      .subscribe({
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
