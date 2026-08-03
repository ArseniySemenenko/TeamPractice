import { Component, Inject, inject, OnInit, signal , linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SkillsService } from '../../services/skills-service';
import { AddCvProjectInput, CvProject, Mastery, SkillMastery } from 'cv-graphql';
import { Skill } from 'cv-graphql';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects-service';
import { Project } from 'cv-graphql';
import {FormsModule} from '@angular/forms';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';


@Component({
    selector: 'app-add-project-dialog',
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
    templateUrl: './add-project-dialog.html',
    styleUrl: './add-project-dialog.css',
})
export class AddProjectDialog {
    private readonly projectsService = inject(ProjectsService);

    public dialogRef = inject(MatDialogRef<AddProjectDialog>);
    public data = inject<{cvId: string, projects: CvProject[]}>(MAT_DIALOG_DATA);

    selectedProject = signal<string>('');
    domain = linkedSignal<string>(() => {
        console.log('selectedProject: ', this.selectedProject());
        return this.allProjects().find( project => project.id == this.selectedProject())?.domain || '';
    });
    description = linkedSignal<string>(() => {
        console.log('selectedProject: ', this.selectedProject());
        return this.allProjects().find( project => project.id == this.selectedProject())?.description || '';
    });
    startDate = signal<string>('');
    endDate = signal<string>('');
    responsibilities = signal<string>('');
    projEnv = linkedSignal<string[]>(() => {
        return this.allProjects().find( project => project.id == this.selectedProject())?.environment || [];
    });

    allProjects = signal<Project[]>([]);

    ngOnInit(): void {
        console.log('cvId: ', this.data.projects);
        this.projectsService.getAllProjects()
        .subscribe((res) => {
            if(res.data?.projects) {
                this.allProjects.set(res.data.projects.filter(project => !this.data.projects.some(dp => dp.name == project.name)));
            }
        })
    }

    onAdd() {
        const result: AddCvProjectInput = {
            cvId: this.data.cvId,
            projectId: this.selectedProject(),
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
