import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { LangsService } from './langs-service';

describe('LangsService', () => {
  let service: LangsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(LangsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});