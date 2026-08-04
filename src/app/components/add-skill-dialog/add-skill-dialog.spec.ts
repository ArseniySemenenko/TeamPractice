import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { AddSkillDialog } from './add-skill-dialog';

describe('AddSkillDialog', () => {
    let component: AddSkillDialog;
    let fixture: ComponentFixture<AddSkillDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AddSkillDialog,
                ApolloTestingModule, // Resolves Apollo injected by Skills/CvsService
            ],
            providers: [
                provideAnimationsAsync(), // Handles Angular Material animations
                {
                    provide: MatDialogRef,
                    useValue: {
                        close: vi.fn(),
                    },
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        cvId: 'cv-123',
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddSkillDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});