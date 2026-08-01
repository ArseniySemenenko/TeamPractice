import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvProjects } from './cv-projects';

describe('CvProjects', () => {
    let component: CvProjects;
    let fixture: ComponentFixture<CvProjects>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvProjects],
        }).compileComponents();

        fixture = TestBed.createComponent(CvProjects);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
