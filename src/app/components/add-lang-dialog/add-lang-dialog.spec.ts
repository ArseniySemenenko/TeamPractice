import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLangDialog } from './add-lang-dialog';

describe('AddLangDialog', () => {
    let component: AddLangDialog;
    let fixture: ComponentFixture<AddLangDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddLangDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(AddLangDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
