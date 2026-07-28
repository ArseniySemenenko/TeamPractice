import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SkillsService } from '../../services/skills-service';
import { Mastery, SkillMastery } from 'cv-graphql';
import { Skill } from 'cv-graphql';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-update-skill-dialog',
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
    templateUrl: './update-skill-dialog.html',
    styleUrl: './update-skill-dialog.css',
})
export class UpdateSkillDialog {

    private readonly skillsService = inject(SkillsService);

    private fb = inject(FormBuilder);
    public dialogRef = inject(MatDialogRef<UpdateSkillDialog>);
    public data = inject<{ skill: SkillMastery }>(MAT_DIALOG_DATA);

    skillForm = this.fb.group({
        skill: [{value: this.data.skill.name, disabled: true} , Validators.required],
        mastery: [this.data.skill.mastery, Validators.required],
    });

    skills = signal<Skill[]>([]);
    masteries = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'];

    onCancel(): void {
        this.dialogRef.close();
    }

    onAdd(): void {
        if (this.skillForm.valid && this.skillForm.value.mastery) {
            const result: { skill: SkillMastery } = {
                skill: {
                    name: this.data.skill.name,
                    categoryId: this.data.skill.categoryId,
                    mastery: this.skillForm.value.mastery as Mastery,
                },
            };
            this.dialogRef.close(result);
        }
    }
}
