import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangsList } from './langs-list';

describe('LangsList', () => {
  let component: LangsList;
  let fixture: ComponentFixture<LangsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangsList],
    }).compileComponents();

    fixture = TestBed.createComponent(LangsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
