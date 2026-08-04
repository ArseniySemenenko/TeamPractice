import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { LangsList } from './langs-list';

describe('LangsList', () => {
  let component: LangsList;
  let fixture: ComponentFixture<LangsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LangsList,
        ApolloTestingModule, // Resolves Apollo injected by LangsService
      ],
      providers: [
        provideRouter([]), // Resolves router navigation or directives
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LangsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});