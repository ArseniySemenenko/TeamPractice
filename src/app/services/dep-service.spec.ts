import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { DepService } from './dep-service';

describe('DepService', () => {
  let service: DepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(DepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});