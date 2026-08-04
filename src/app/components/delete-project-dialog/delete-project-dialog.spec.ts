import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest';

import { DeleteProjectDialog } from './delete-project-dialog';

describe('DeleteProjectDialog', () => {
    let component: DeleteProjectDialog;
    let fixture: ComponentFixture<DeleteProjectDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DeleteProjectDialog,
                ApolloTestingModule, // Resolves Apollo if Projects/CvsService is injected
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
                        projectId: 'proj-456',
                        projectName: 'Sample Project',
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteProjectDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});