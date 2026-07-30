import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCvDialog } from './add-cv-dialog';

describe('AddCvDialog', () => {
    let component: AddCvDialog;
    let fixture: ComponentFixture<AddCvDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddCvDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(AddCvDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
