import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { AddCvDialog } from './add-cv-dialog';

describe('AddCvDialog', () => {
    let component: AddCvDialog;
    let fixture: ComponentFixture<AddCvDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AddCvDialog,
                ApolloTestingModule, // Provides Apollo if CvsService/GraphQL is used
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: vi.fn(),
                    },
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}, // Pass any dummy data object if expected
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddCvDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});