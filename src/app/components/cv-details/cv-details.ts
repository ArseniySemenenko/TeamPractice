import { Component , input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink , RouterLinkActive , RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-cv-details',
    imports: [MatTabsModule , RouterLink , RouterLinkActive , RouterOutlet],
    templateUrl: './cv-details.html',
    styleUrl: './cv-details.css',
})
export class CvDetails {
    cvId = input();
}
