import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { Forgot } from './forgot';

describe('Forgot', () => {
  let component: Forgot;
  let fixture: ComponentFixture<Forgot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Forgot,
        ApolloTestingModule, // Resolves Apollo injected by AuthService
      ],
      providers: [
        provideRouter([]), // Resolves router links/directives
        provideAnimationsAsync(), // Disables/handles Angular Material animations during tests
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Forgot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});