import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing'; // 1. Import ApolloTestingModule

import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule], // 2. Add ApolloTestingModule here
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});