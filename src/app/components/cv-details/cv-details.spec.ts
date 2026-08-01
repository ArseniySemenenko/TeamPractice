import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvDetails } from './cv-details';

describe('CvDetails', () => {
    let component: CvDetails;
    let fixture: ComponentFixture<CvDetails>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvDetails],
        }).compileComponents();

        fixture = TestBed.createComponent(CvDetails);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
