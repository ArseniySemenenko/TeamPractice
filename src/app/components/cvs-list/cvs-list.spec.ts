import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvsList } from './cvs-list';

describe('CvsList', () => {
    let component: CvsList;
    let fixture: ComponentFixture<CvsList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CvsList,
                ApolloTestingModule, // Resolves Apollo injected by CvsService
            ],
            providers: [
                provideRouter([]), // Resolves router directives/navigation dependencies
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CvsList);

        // If CvsList accepts a required input (e.g., userId), set it here:
        // fixture.componentRef.setInput('userId', 'user-123');

        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});