import { Component, inject , signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Cv, CvProject, Project, RemoveCvProjectInput } from 'cv-graphql';
import { ProjectsService } from '../../services/projects-service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-delete-project-dialog',
    imports: [MatIconModule, MatDialogModule, MatButtonModule],
    templateUrl: './delete-project-dialog.html',
    styleUrl: './delete-project-dialog.css',
})
export class DeleteProjectDialog implements OnInit {
    private readonly projectsService = inject(ProjectsService);

    dialogRef = inject(MatDialogRef<DeleteProjectDialog>);
    public data = inject<{ cvId: string,  project: CvProject }>(MAT_DIALOG_DATA);

    allProjects = signal<Project[]>([]);

    ngOnInit(){
        this.projectsService.getAllProjects()
        .subscribe((res) => {
            if(res.data?.projects) {
                this.allProjects.set(res.data.projects);
            }
        })
    }

    onAdd() {
        const result: RemoveCvProjectInput ={
            cvId: this.data.cvId,
            projectId: this.data.project.project.id, //important!!!

        }
        this.dialogRef.close(result);
    }

    onCancel() {
        this.dialogRef.close();
    }
}
