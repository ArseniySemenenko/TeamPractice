import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvPreview } from './cv-preview';

describe('CvPreview', () => {
    let component: CvPreview;
    let fixture: ComponentFixture<CvPreview>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CvPreview,
                ApolloTestingModule, // Resolves Apollo injected by CvsService
            ],
            providers: [
                provideRouter([]), // Resolves router links/directives
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CvPreview);

        // Set required signal input before change detection/stability checks
        fixture.componentRef.setInput('cvId', 'cv-123');

        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});