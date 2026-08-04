import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLangDialog } from './add-lang-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LangsService } from '../../services/langs-service';
import { of } from 'rxjs';

describe('AddLangDialog', () => {
    let component: AddLangDialog;
    let fixture: ComponentFixture<AddLangDialog>;

    // 1. Мок для сервиса языков
    const mockLangsService = {
        getAllLangs: () => of({ data: { languages: [] } })
    };

    // 2. Мок для Dialog Reference (простая функция-заглушка)
    const mockDialogRef = {
        close: (result?: any) => {} 
    };

    // 3. Мок данных диалога
    const mockDialogData = {
        langs: []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddLangDialog],
            providers: [
                // Для Angular 18+ анимации лучше отключать через provideNoopAnimations
                { provide: LangsService, useValue: mockLangsService },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddLangDialog);
        component = fixture.componentInstance;
        fixture.detectChanges(); // Запускает ngOnInit
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
