import { Component, Inject, inject, OnInit, signal , linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SkillsService } from '../../services/skills-service';
import { AddCvProjectInput, CvProject, Mastery, SkillMastery, UpdateCvProjectInput } from 'cv-graphql';
import { Skill } from 'cv-graphql';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects-service';
import { Project } from 'cv-graphql';
import {FormsModule} from '@angular/forms';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

@Component({
    selector: 'app-update-project-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatChipsModule,
    ],
    templateUrl: './update-project-dialog.html',
    styleUrl: './update-project-dialog.css',
})
export class UpdateProjectDialog {
    private readonly projectsService = inject(ProjectsService);

    public dialogRef = inject(MatDialogRef<UpdateProjectDialog>);
    public data = inject<{cvId: string, project: CvProject}>(MAT_DIALOG_DATA);

    selectedProject = signal<string>(this.data.project.id);
    domain = signal<string>(this.data.project.domain);
    description = signal<string>(this.data.project.description);
    startDate = signal<string>(this.data.project.start_date);
    endDate = signal<string>(this.data.project.end_date || '');
    responsibilities = signal<string>(this.data.project.responsibilities.join('\n\n'));
    projEnv = signal<string[]>(this.data.project.environment);

    onAdd() {
        const result: UpdateCvProjectInput = {
            cvId: this.data.cvId,
            projectId: this.data.project.project.id, //important!!!
            start_date: new Date(this.startDate()).toISOString(),
            end_date: new Date(this.endDate()).toISOString(),
            responsibilities: this.responsibilities().split(/\n\s*\n/),
            roles: [],
        };
        this.dialogRef.close(result);
    }

    onCancel() {
        this.dialogRef.close();
    }
}
