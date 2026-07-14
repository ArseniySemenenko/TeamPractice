import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { FirstLetterUpperPipe } from '../../pipes/first-letter-upper-pipe';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink, RouterLinkActive, FirstLetterUpperPipe],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  filter = input<'employees' | 'skills' | 'languages' | 'cvs'>('employees');
}
