import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Language, LanguageProficiency, Proficiency } from 'cv-graphql';
import {CvsService} from '../../services/cvs-service';
import { CreateCvInput } from 'cv-graphql';

@Component({
    selector: 'app-add-cv-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    templateUrl: './add-cv-dialog.html',
    styleUrl: './add-cv-dialog.css',
})
export class AddCvDialog {
    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<AddCvDialog>);
    public data = inject<{langs: LanguageProficiency[]}>(MAT_DIALOG_DATA);

    cvForm = this.fb.group({
        name: ['' , Validators.required],
        education: ['' , Validators.required],
        description: ['' , Validators.required],
    });

    onCancel(){
        this.dialogRef.close();
    }

    onAdd(){
        const result: CreateCvInput = {
            name: this.cvForm.value.name ?? '',
            education: this.cvForm.value.education ?? '',
            description: this.cvForm.value.description ?? '',
        };

        this.dialogRef.close(result);
    }
}
