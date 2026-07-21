import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { Employee, UsersService } from '../../services/users-service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CdkTableModule } from "@angular/cdk/table";
import { MatIconModule } from '@angular/material/icon';
import {MatSort, MatSortModule, SortDirection} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, ViewChild} from '@angular/core';
import { Sort, } from '@angular/material/sort';
import { CdkFixedSizeVirtualScroll } from "@angular/cdk/scrolling";
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-employees-list',
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatSort, MatTableModule, MatFormFieldModule, MatInputModule, MatTableModule, CdkTableModule, MatIconModule, CdkFixedSizeVirtualScroll, RouterLink],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.scss',
})
export class EmployeesList implements OnInit{
  private readonly usersService = inject(UsersService);

  //employees = signal<Employee[]>([]);

  //dataSource = linkedSignal(() => new MatTableDataSource(this.employees()));

  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = ['avatar' , 'f_name' , 'l_name' , 'email' , 'department' , 'position' , 'buttons']; 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  @ViewChild(MatSort , { static: false}) sort!: MatSort;

  ngAfterViewInit() {
    console.log('Sort initialized:', this.sort);
    this.dataSource.sort = this.sort;
  }

  ngOnInit(){


    //
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'f_name': return item.profile?.first_name?.toLowerCase();
        case 'l_name': return item.profile?.last_name?.toLowerCase();
        // Указываем точное поле для колонки department:
        case 'department': return item.department_name?.toLowerCase(); 
        case 'position': return item.position_name?.toLowerCase();
        default: return item[property];
      }
    };

    this.usersService.getEmployees().subscribe((res) => {
      if(res.data){
        this.dataSource.data = res.data.users; 
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        console.log(res.data.users);
      }
    })
  }
}
