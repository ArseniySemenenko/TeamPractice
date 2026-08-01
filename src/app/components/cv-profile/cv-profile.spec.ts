import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvProfile } from './cv-profile';

describe('CvProfile', () => {
    let component: CvProfile;
    let fixture: ComponentFixture<CvProfile>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvProfile],
        }).compileComponents();

        fixture = TestBed.createComponent(CvProfile);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
