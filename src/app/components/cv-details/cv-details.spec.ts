import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvDetails } from './cv-details';

describe('CvDetails', () => {
    let component: CvDetails;
    let fixture: ComponentFixture<CvDetails>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CvDetails,
                ApolloTestingModule, // Resolves Apollo injected by CvsService
            ],
            providers: [
                provideRouter([]), // Resolves route parameters/directives
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CvDetails);

        // Set the required signal input before change detection/stability checks
        fixture.componentRef.setInput('cvId', 'cv-123');

        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});