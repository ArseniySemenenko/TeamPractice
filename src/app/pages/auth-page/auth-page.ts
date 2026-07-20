import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-auth-page',
  imports: [MatTabsModule , FormsModule, RouterLink, RouterLinkActive, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterOutlet],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  hidePassword = signal<boolean>(true);
  filter = input<'login' | 'signup' | 'forgot-password'>("login");
}
