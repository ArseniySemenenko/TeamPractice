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
import {MatIconModule} from '@angular/material/icon';

export interface SkillData {
    skill: SkillMastery;
}

export interface DialogData {
    skills: SkillMastery[];
}

@Component({
    selector: 'app-add-skill-dialog',
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
    templateUrl: './add-skill-dialog.html',
    styleUrl: './add-skill-dialog.css',
})
export class AddSkillDialog implements OnInit {
    private readonly skillsService = inject(SkillsService);

    private fb = inject(FormBuilder);
    public dialogRef = inject(MatDialogRef<AddSkillDialog>);
    public data = inject<DialogData>(MAT_DIALOG_DATA);

    skillForm = this.fb.group({
        skill: ['', Validators.required],
        mastery: ['', Validators.required],
    });

    skills = signal<Skill[]>([]);
    masteries = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'];

    ngOnInit(): void {
        this.skillsService.getAllSkills().subscribe((res) => {
            if (res.data?.skills) {
                this.skills.set(res.data?.skills.filter(skill => !this.data.skills.some(ds => ds.name == skill.name)));
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onAdd(): void {
        if (this.skillForm.valid && this.skillForm.value.skill && this.skillForm.value.mastery) {
            const result: SkillData = {
                skill: {
                    name: this.skillForm.value.skill,
                    categoryId: this.skills().find(skill => skill.name == this.skillForm.value.skill)?.category?.id,
                    mastery: this.skillForm.value.mastery as Mastery,
                },

            };
            this.dialogRef.close(result);
        }
    }
}
