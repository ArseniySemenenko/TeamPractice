import { Component , inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth-service';

@Component({
    selector: 'app-verify-mail',
    imports: [
        MatButtonModule,
    ],
    templateUrl: './verify-mail.html',
    styleUrl: './verify-mail.css',
})
export class VerifyMail {
    
}
