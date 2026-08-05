import { Component , inject , signal , computed, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth-service';
import { MatInputModule, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { VerifyService } from '../../services/verify-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatError } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthInput } from 'cv-graphql';
import { RouterLink } from '@angular/router';
import { TokensService } from '../../services/tokens-service';

@Component({
    selector: 'app-verify-mail',
    imports: [
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatError,
    MatIconModule,
    RouterLink,
],
    templateUrl: './verify-mail.html',
    styleUrl: './verify-mail.css',
})
export class VerifyMail {
    private readonly verifyService = inject(VerifyService);
    private readonly authService = inject(AuthService);

    isLogined = linkedSignal( () => {
        return this.authService.isAuth();
    })
    isVerifyDone = signal(false);

    inputValue = signal('');
    error = signal('');

    submitVerify(){
        console.log(this.inputValue());
        if(this.inputValue() == ''){
            this.error.set('Code cant be empty');
            return;
        }

        this.verifyService.verifyMail({
            otp: this.inputValue()
        })
        .subscribe({
            next: () => {
                this.isVerifyDone.set(true);
            },

            error: (err) => {
                if(err.message == "Invalid credentials"){
                this.error.set("Code is wrong or alredy was used");
              }
            }
        })
    }



    loginError = signal("");
    
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
          
          this.authService.verify_login(payload)
          .subscribe({
            next: () => {this.isLogined.set(true)},
            error: (err) => {
              if(err.message == "Invalid credentials"){
                this.error.set("Wrong email or password");
              }
            }
          });
        }
      }
}
