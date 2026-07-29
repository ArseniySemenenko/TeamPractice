import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Language, LanguageProficiency, Proficiency } from 'cv-graphql';
import { LangsService } from '../../services/langs-service';

@Component({
    selector: 'app-update-lang-dialog',
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
    templateUrl: './update-lang-dialog.html',
    styleUrl: './update-lang-dialog.css',
})
export class UpdateLangDialog {
    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<UpdateLangDialog>);
    public data = inject<{ lang: LanguageProficiency }>(MAT_DIALOG_DATA);

    profs = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

    langForm = this.fb.group({
        lang: [{ value: this.data.lang.name, disabled: true }, Validators.required],
        proficiency: [this.data.lang.proficiency, Validators.required],
    });

    onCancel() {
        this.dialogRef.close();
    }

    onAdd() {
        if (this.langForm.valid && this.langForm.value.proficiency) {
            const result: { lang: LanguageProficiency } = {
                lang: {
                    name: this.data.lang.name,
                    proficiency: this.langForm.value.proficiency,
                },
            };
            this.dialogRef.close(result);
        }
    }
}
