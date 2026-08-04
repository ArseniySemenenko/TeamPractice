import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CvProfile } from './cv-profile';
import { CvsService } from '../../services/cvs-service';

describe('CvProfile', () => {
  let component: CvProfile;
  let fixture: ComponentFixture<CvProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvProfile, ApolloTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: CvsService,
          useValue: {
            getCvProfileById: () => of({ data: { cv: { name: 'Test', education: 'BS', description: 'Desc' } } }),
            updateCvProfileById: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CvProfile);

    // Set required signal input BEFORE fixture.detectChanges() / whenStable()
    fixture.componentRef.setInput('cvId', 'test-cv-123');

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});