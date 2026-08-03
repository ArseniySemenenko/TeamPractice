import { Component, inject, OnInit, input, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CvsService } from '../../services/cvs-service';
import { Cv } from 'cv-graphql';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { AddCvDialog } from '../add-cv-dialog/add-cv-dialog';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCvDialog } from '../delete-cv-dialog/delete-cv-dialog';
import { AddProjectDialog } from '../add-project-dialog/add-project-dialog';
import { ProjectsService } from '../../services/projects-service';
import { CvProject } from 'cv-graphql';
import { DeleteProjectDialog } from '../delete-project-dialog/delete-project-dialog';
import { UpdateProjectDialog } from '../update-project-dialog/update-project-dialog';

@Component({
    selector: 'app-cv-projects',
    imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSortModule,
        MatSort,
        RouterLink,
    ],
    templateUrl: './cv-projects.html',
    styleUrl: './cv-projects.css',
})
export class CvProjects {
    private readonly cvsService = inject(CvsService);
    private readonly dialog = inject(MatDialog);
    private readonly projectsService = inject(ProjectsService);

    readonly authService = inject(AuthService);

    cvId = input.required<string>();

    dataSource = new MatTableDataSource<CvProject>([]);
    displayedColumns: string[] = ['name', 'domain', 'start-date', 'end-date', 'actions'];

    addedProjects = signal<CvProject[]>([]);

    ngOnInit() {
        this.projectsService.getCvProjects(this.cvId()).subscribe({
            next: (result) => {
                if (result.data?.cv?.projects) {
                    this.addedProjects.set(result.data.cv.projects);
                    this.dataSource.data = result.data.cv.projects;
                    console.log('cv projects: ', result.data.cv.projects);
                }
            },
            error: (error) => {
                console.error('Error fetching CV projects:', error);
            },
        });
    }

    @ViewChild(MatSort, { static: false }) sort!: MatSort;

    ngAfterViewInit() {
        console.log('Sort initialized:', this.sort);
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openUpdateProjectDialog(project: CvProject) {
        const dialogRef = this.dialog.open(UpdateProjectDialog, {
            width: '1000px',
            maxWidth: '1000px',
            disableClose: true,
            data: {
                cvId: this.cvId(),
                project: project,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.projectsService.updateCvProject(result).subscribe((res) => {
                    this.addedProjects.set(res.data?.updateCvProject.projects || []);
                    this.dataSource.data = res.data?.updateCvProject.projects || [];
                    console.log(
                        'Updated cv projects after update: ',
                        res.data?.updateCvProject.projects,
                    );
                });
            }
        });
    }

    openDeleteProjectDialog(project: CvProject) {
        const dialogRef = this.dialog.open(DeleteProjectDialog, {
            width: '500px',
            data: { project: project, cvId: this.cvId() },
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('DeleteProjectDialog closed with result:', result);
            this.projectsService.deleteCvProject(result).subscribe((res) => {
                this.addedProjects.set(res.data?.removeCvProject.projects || []);
                this.dataSource.data = res.data?.removeCvProject.projects || [];
                console.log(
                    'Updated cv projects after deletion: ',
                    res.data?.removeCvProject.projects,
                );
            });
        });
    }

    openAddProjectDialog() {
        const dialogRef = this.dialog.open(AddProjectDialog, {
            width: '1000px',
            maxWidth: '1000px',
            disableClose: true,
            data: {
                cvId: this.cvId(), // Replace with the actual CV ID you want to pass
                projects: this.addedProjects(), // Replace with the actual list of projects if needed
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('AddProjectDialog closed with result:', result);
                this.projectsService.addCvProject(result).subscribe((res) => {
                    console.log('addCvProject res: ', res);
                    if (res.data?.addCvProject.projects) {
                        this.addedProjects.set(res.data.addCvProject.projects);
                        this.dataSource.data = res.data.addCvProject.projects;
                        console.log('Updated cv projects: ', res.data.addCvProject.projects);
                    }
                });
            }
        });
    }
}
