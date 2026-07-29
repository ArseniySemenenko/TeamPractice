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
import { LangsService } from '../../services/langs-service';

@Component({
    selector: 'app-add-lang-dialog',
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
    templateUrl: './add-lang-dialog.html',
    styleUrl: './add-lang-dialog.css',
})
export class AddLangDialog implements OnInit{
    private readonly langsService = inject(LangsService);

    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<AddLangDialog>);
    public data = inject<{langs: LanguageProficiency[]}>(MAT_DIALOG_DATA);

    langForm = this.fb.group({
        lang: ['' , Validators.required],
        proficiency: ['' , Validators.required],
    });

    langs = signal<Language[]>([]);
    profs = ['A1' , 'A2' , 'B1' , 'B2' , 'C1' , 'C2' , 'Native'];

    onCancel(){
        this.dialogRef.close();
    }

    onAdd(){
        if(this.langForm.valid && this.langForm.value.lang && this.langForm.value.proficiency){
            const result: {lang: LanguageProficiency} = {
                lang: {
                    name: this.langForm.value.lang,
                    proficiency: this.langForm.value.proficiency as Proficiency,
                }
            };

            this.dialogRef.close(result);
        }
    }

    ngOnInit(): void {
        this.langsService.getAllLangs()
        .subscribe((res) => {
            if(res.data?.languages){
                this.langs.set(res.data.languages.filter(lang => !this.data.langs.some(dl => lang.name == dl.name)));
                console.log(this.langs());
            }
        })
    }
}
