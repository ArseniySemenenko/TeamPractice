import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { CvsService } from './cvs-service';

describe('CvsService', () => {
  let service: CvsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(CvsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});