import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkTableModule } from '@angular/cdk/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from 'cv-graphql';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserDialog } from '../update-user-dialog/update-user-dialog';
import { subscribe } from 'graphql';

@Component({
    selector: 'app-employees-list',
    imports: [
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatSort,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        CdkTableModule,
        MatIconModule,
        CdkFixedSizeVirtualScroll,
        RouterLink,
    ],
    templateUrl: './employees-list.html',
    styleUrl: './employees-list.css',
})
export class EmployeesList implements OnInit {
    private readonly usersService = inject(UsersService);
    readonly authService = inject(AuthService);

    private readonly dialog = inject(MatDialog);

    //employees = signal<Employee[]>([]);

    //dataSource = linkedSignal(() => new MatTableDataSource(this.employees()));

    dataSource = new MatTableDataSource<User>([]);
    displayedColumns: string[] = [
        'avatar',
        'f_name',
        'l_name',
        'email',
        'department',
        'position',
        'buttons',
    ];

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    @ViewChild(MatSort, { static: false }) sort!: MatSort;

    ngAfterViewInit() {
        console.log('Sort initialized:', this.sort);
        this.dataSource.sort = this.sort;
    }

    openUpdateUserDialog(user: User){
        const dialogRef = this.dialog.open(UpdateUserDialog, {
                    width: '1000px',
                    maxWidth: '1000px',
                    disableClose: true,
                    data: {
                        user: user,
                    }
                });

        dialogRef.afterClosed()
        .subscribe((res) => {
            if(res){
                this.usersService.updateProfile(res.res2.userId , res.res2.first_name , res.res2.last_name)
                .subscribe((result) => {
                    if (result.data?.updateProfile) {
                        this.usersService.updateUser(res.res1.userId , res.res1.departmentId, res.res1.positionId)
                        .subscribe((result2) => {
                            if(result2){
                                this.fetchUsers();
                            }
                        })
                    }
                })                
            }
        })
    }

    fetchUsers(){
        this.usersService.getEmployees().subscribe((res) => {
            if (res.data) {
                //set current user first at list
                const currentUser = res.data.users.find(user => user.id == this.authService.currentUserId());
                if(currentUser){
                    this.dataSource.data = [currentUser , ...res.data.users.filter(user => user.id != this.authService.currentUserId())];
                }else{
                  this.dataSource.data = res.data.users;
                }
                if (this.sort) {
                    this.dataSource.sort = this.sort;
                }
                console.log(res.data.users);
            }
        });
    }

    ngOnInit() {
        this.dataSource.sortingDataAccessor = (item: any, property: string) => {
            switch (property) {
                case 'f_name':
                    return item.profile?.first_name?.toLowerCase();
                case 'l_name':
                    return item.profile?.last_name?.toLowerCase();
                case 'department':
                    return item.department_name?.toLowerCase();
                case 'position':
                    return item.position_name?.toLowerCase();
                default:
                    return item[property];
            }
        };

        this.fetchUsers();
        
    }
}
