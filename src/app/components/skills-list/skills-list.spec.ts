import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { SkillsList } from './skills-list';

describe('SkillsList', () => {
  let component: SkillsList;
  let fixture: ComponentFixture<SkillsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SkillsList,
        ApolloTestingModule, // Resolves missing Apollo provider
      ],
      providers: [
        provideRouter([]), // Resolves router directive/service injection
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});