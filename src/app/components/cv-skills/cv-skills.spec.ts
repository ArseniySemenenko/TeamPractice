import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvSkills } from './cv-skills';

describe('CvSkills', () => {
    let component: CvSkills;
    let fixture: ComponentFixture<CvSkills>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvSkills],
        }).compileComponents();

        fixture = TestBed.createComponent(CvSkills);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
