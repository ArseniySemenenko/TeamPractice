import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvProjects } from './cv-projects';

describe('CvProjects', () => {
  let component: CvProjects;
  let fixture: ComponentFixture<CvProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CvProjects,
        ApolloTestingModule,
      ],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CvProjects);

    // Provide the required cvId signal input before lifecycle hooks execute
    fixture.componentRef.setInput('cvId', 'cv-123');

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});