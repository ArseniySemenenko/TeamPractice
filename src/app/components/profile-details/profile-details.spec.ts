import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { ProfileDetails } from './profile-details';

describe('ProfileDetails', () => {
  let component: ProfileDetails;
  let fixture: ComponentFixture<ProfileDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileDetails,
        ApolloTestingModule, // Handles Apollo injection if underlying services are used
      ],
      providers: [
        provideRouter([]), // Handles router directives/navigation if present
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileDetails);

    // Provide the required signal input BEFORE change detection / lifecycle hooks execute
    fixture.componentRef.setInput('userId', 'user-123');

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});