import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { AddProjectDialog } from './add-project-dialog';

describe('AddProjectDialog', () => {
    let component: AddProjectDialog;
    let fixture: ComponentFixture<AddProjectDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AddProjectDialog,
                ApolloTestingModule, // Resolves Apollo injected by ProjectsService/CvsService
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

        fixture = TestBed.createComponent(AddProjectDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});