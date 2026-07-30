import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvsList } from './cvs-list';

describe('CvsList', () => {
    let component: CvsList;
    let fixture: ComponentFixture<CvsList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvsList],
        }).compileComponents();

        fixture = TestBed.createComponent(CvsList);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
