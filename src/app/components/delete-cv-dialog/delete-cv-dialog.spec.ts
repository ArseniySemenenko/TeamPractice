import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { vi } from 'vitest'; // Remove if using Jest (Jest provides vi-like mocks natively)

import { DeleteCvDialog } from './delete-cv-dialog';

describe('DeleteCvDialog', () => {
  let component: DeleteCvDialog;
  let fixture: ComponentFixture<DeleteCvDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeleteCvDialog,
        ApolloTestingModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: vi.fn(), // Using Vitest mock function
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            cvId: 'test-cv-123',
            name: 'Sample CV',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCvDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});