import { TestBed } from '@angular/core/testing';

import { CvsHeaderService } from './cvs-header-service';

describe('CvsHeaderService', () => {
    let service: CvsHeaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CvsHeaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
