import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateSkillDialog } from './update-skill-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillsService } from '../../services/skills-service';
import { of } from 'rxjs';
import { Mastery } from 'cv-graphql';

describe('UpdateSkillDialog', () => {
    let component: UpdateSkillDialog;
    let fixture: ComponentFixture<UpdateSkillDialog>;

    // 1. Мок для сервиса навыков
    const mockSkillsService = {
        getAllSkills: () => of({ data: { skills: [] } })
    };

    // 2. Мок для Dialog Reference (чистая стрелочная функция)
    const mockDialogRef = {
        close: (result?: any) => {} 
    };

    // 3. Валидный мок данных диалога (необходим для инициализации формы)
    const mockDialogData = {
        skill: {
            name: 'TypeScript',
            categoryId: 'frontend-123',
            mastery: 'Advanced'
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpdateSkillDialog],
            providers: [
                { provide: SkillsService, useValue: mockSkillsService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateSkillDialog);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Запускает жизненный цикл Angular
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog with updated data when onAdd is called and form is valid', () => {
        // Меняем уровень владения в форме
        component.skillForm.patchValue({
            mastery: 'Expert' as Mastery,
        });

        // Ручной шпион для перехвата переданных данных
        let closedData: any = null;
        component.dialogRef.close = (result) => {
            closedData = result;
        };

        component.onAdd();

        // Проверяем, что вернулся правильный объект на основе mockDialogData и формы
        expect(closedData).toEqual({
            skill: {
                name: 'TypeScript',
                categoryId: 'frontend-123',
                mastery: 'Expert'
            }
        });
    });

    it('should close dialog without data when onCancel is called', () => {
        let closeCalled = false;
        component.dialogRef.close = (result) => {
            if (result === undefined) {
                closeCalled = true;
            }
        };

        component.onCancel();

        expect(closeCalled).toBe(true);
    });
});
