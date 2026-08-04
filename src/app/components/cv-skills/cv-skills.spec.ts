import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvSkills } from './cv-skills';

describe('CvSkills', () => {
  let component: CvSkills;
  let fixture: ComponentFixture<CvSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvSkills, ApolloTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CvSkills);

    // Set required input before stability / change detection if CvSkills uses input.required()
    fixture.componentRef.setInput('cvId', 'cv-123');

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});