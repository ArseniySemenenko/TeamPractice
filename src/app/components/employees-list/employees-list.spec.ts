import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { EmployeesList } from './employees-list';

describe('EmployeesList', () => {
  let component: EmployeesList;
  let fixture: ComponentFixture<EmployeesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeesList,
        ApolloTestingModule, // Resolves Apollo dependency injected by Users/Employees service
      ],
      providers: [
        provideRouter([]), // Resolves router directives/navigation dependencies
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesList);

    // If EmployeesList relies on a required signal input, set it here:
    // fixture.componentRef.setInput('inputName', value);

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});