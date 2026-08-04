import { Component , inject, input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink , RouterLinkActive , RouterOutlet} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CvsHeaderService } from '../../services/cvs-header-service';

@Component({
    selector: 'app-cv-details',
    imports: [MatTabsModule , RouterLink , RouterLinkActive , RouterOutlet, MatIconModule],
    templateUrl: './cv-details.html',
    styleUrl: './cv-details.css',
})
export class CvDetails {
    cvId = input();
    cvHeader = inject(CvsHeaderService);
}
