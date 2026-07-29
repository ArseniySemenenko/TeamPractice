import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLangDialog } from './update-lang-dialog';

describe('UpdateLangDialog', () => {
    let component: UpdateLangDialog;
    let fixture: ComponentFixture<UpdateLangDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpdateLangDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateLangDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
