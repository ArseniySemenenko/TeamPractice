import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-page',
  imports: [RouterLink, RouterLinkActive, MatButtonModule , MatFormFieldModule , MatIconModule , MatInputModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  hidePassword = signal<boolean>(true);
  filter = input<string>("login");
}
