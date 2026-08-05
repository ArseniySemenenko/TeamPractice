import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatError, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-reset-password',
    imports: [MatFormField, MatError, MatLabel, CommonModule, MatInputModule, FormsModule, MatButton],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css',
})
export class ResetPassword {
    private readonly authService = inject(AuthService);

    token = input.required<string>();
    error = signal('');
    password = signal('');

    isDone = signal(false);

    isSubmitDisabled = signal(false);

    submitForm() {
        console.log(this.password());
        this.isSubmitDisabled.set(true);
        
        if (this.password() == '') {
            this.error.set('password is null');
            this.isSubmitDisabled.set(false);
            return;
        }

        this.authService
            .resetPassword(
                {
                    newPassword: this.password(),
                },
                this.token(),
            )
            .subscribe({
                next: () => {
                    this.isDone.set(true);
                },

                error: (err) => {
                    this.isSubmitDisabled.set(false);
                    if (err.message == 'Invalid credentials') {
                        this.error.set('Wrong email or password');
                    }
                },
            });
    }
}
