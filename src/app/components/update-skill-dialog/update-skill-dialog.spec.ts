import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSkillDialog } from './update-skill-dialog';

describe('UpdateSkillDialog', () => {
    let component: UpdateSkillDialog;
    let fixture: ComponentFixture<UpdateSkillDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpdateSkillDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateSkillDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
