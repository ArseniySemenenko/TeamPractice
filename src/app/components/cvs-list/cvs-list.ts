import { Component, inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-cvs-list',
    imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSortModule,
        MatSort,
        RouterLink,
    ],
    templateUrl: './cvs-list.html',
    styleUrl: './cvs-list.css',
})
export class CvsList implements OnInit {
    private readonly cvsService = inject(CvsService);
    private readonly dialog = inject(MatDialog);

    readonly authService = inject(AuthService);

    dataSource = new MatTableDataSource<Cv>([]);
    displayedColumns: string[] = ['name', 'education', 'employee', 'actions' ];

    ngOnInit() {
        this.cvsService.getCvs().subscribe({
            next: (result) => {
                if (result.data?.cvs) {
                    this.dataSource.data = result.data.cvs;
                    console.log(result.data.cvs);
                }
            },
            error: (error) => {
                console.error('Error fetching CVs:', error);
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

    openDeleteCvDialog(cv: Cv){
        const dialogRef = this.dialog.open(DeleteCvDialog , {
            width: '500px',
            data: { cv: cv },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.cvsService.deleteCvById(
                    {
                        cvId: result.cv.id,
                    }
                )
                .subscribe(res => {
                    if(res){
                        this.dataSource.data = this.dataSource.data.filter(elem => elem.id != result.cv.id);
                    }
                }) 
            }
        })
    }

    openAddCvDialog() {
        const dialogRef = this.dialog.open(AddCvDialog, {
            width: '500px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(result);
                this.cvsService.createCv({
                    userId: this.authService.currentUserId() ?? '',
                    name: result.name,
                    education: result.education,
                    description: result.description,
                })
                .subscribe((res) => {
                    console.log('create res: ' , res);
                    if(res.data?.createCv){
                        this.dataSource.data = [...this.dataSource.data , res.data?.createCv];
                    }
                })
            }
        });
    }
}