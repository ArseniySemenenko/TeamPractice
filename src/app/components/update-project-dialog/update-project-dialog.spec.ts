import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { UpdateProjectDialog } from './update-project-dialog';

describe('UpdateProjectDialog', () => {
    let component: UpdateProjectDialog;
    let fixture: ComponentFixture<UpdateProjectDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                UpdateProjectDialog,
                ApolloTestingModule,
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
                    useValue: {
                        cvId: 'cv-123',
                        project: {
                            id: 'cv-proj-123',
                            domain: 'Frontend',
                            description: 'Sample description',
                            start_date: '2025-01-01',
                            end_date: '2026-01-01',
                            responsibilities: ['Architected UI', 'Wrote unit tests'], // Required to prevent .join() error
                            environment: ['Angular', 'Tailwind'],
                            project: {
                                id: 'proj-456', // Required for onAdd()
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateProjectDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});