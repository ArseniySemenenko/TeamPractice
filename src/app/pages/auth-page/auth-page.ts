import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import {MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-auth-page',
  imports: [RouterLink, RouterLinkActive, MatButtonModule , MatFormFieldModule , MatInputModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  filter = input<string>("login");
}
