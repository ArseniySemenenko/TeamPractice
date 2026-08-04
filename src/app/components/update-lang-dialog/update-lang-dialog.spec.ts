import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { UpdateLangDialog } from './update-lang-dialog';

describe('UpdateLangDialog', () => {
    let component: UpdateLangDialog;
    let fixture: ComponentFixture<UpdateLangDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                UpdateLangDialog,
                ApolloTestingModule,
            ],
            providers: [
                provideAnimationsAsync(),
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: vi.fn(),
                    },
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        lang: {
                            name: 'English',
                            proficiency: 'Native',
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateLangDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});