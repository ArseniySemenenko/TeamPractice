import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCvDialog } from './delete-cv-dialog';

describe('DeleteCvDialog', () => {
    let component: DeleteCvDialog;
    let fixture: ComponentFixture<DeleteCvDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeleteCvDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteCvDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
