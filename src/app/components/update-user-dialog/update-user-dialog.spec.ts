import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../services/auth-service';
import { DepService } from '../../services/dep-service';
import { PosService } from '../../services/pos-service';
import { UpdateUserDialog } from './update-user-dialog';

describe('UpdateUserDialog', () => {
    let component: UpdateUserDialog;
    let fixture: ComponentFixture<UpdateUserDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                UpdateUserDialog,
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
                        user: {
                            id: 'user-123',
                            email: 'john.doe@example.com',
                            role: 'Admin',
                            profile: {
                                first_name: 'John',
                                last_name: 'Doe',
                            },
                            department: {
                                id: 'dep-123',
                                name: 'Engineering',
                            },
                            position: {
                                id: 'pos-123',
                                name: 'Frontend Engineer',
                            },
                        },
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        currentUserPassword: () => 'mock-password',
                    },
                },
                {
                    provide: DepService,
                    useValue: {
                        getDepartments: () => of({ data: { departments: [] } }),
                    },
                },
                {
                    provide: PosService,
                    useValue: {
                        getPositions: () => of({ data: { positions: [] } }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateUserDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});