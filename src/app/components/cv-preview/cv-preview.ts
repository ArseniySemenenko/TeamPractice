import {
    Component,
    inject,
    input,
    OnInit,
    signal,
    computed,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { SkillMastery } from 'cv-graphql';
import { Cv } from 'cv-graphql';
import { CvsService } from '../../services/cvs-service';
import { SkillCategory } from 'cv-graphql';
import { SkillsService } from '../../services/skills-service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Skill } from 'cv-graphql';
import { MatButtonModule } from '@angular/material/button';
import { PdfService } from '../../services/pdf-service';
import { F } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-cv-preview',
    imports: [MatTableModule, MatButtonModule],
    templateUrl: './cv-preview.html',
    styleUrl: './cv-preview.css',
})
export class CvPreview implements OnInit {
    private readonly cvsService = inject(CvsService);
    private readonly skillsService = inject(SkillsService);
    private readonly pdfService = inject(PdfService);

    exportLock = signal(false);

    @ViewChild('preview', { static: false }) contentElement!: ElementRef;

    ngAfterViewChild() {
        this.exportPdf();
    }


    exportPdf() {
    this.exportLock.set(true);

    // 1. Собираем существующие стили приложения
    let cssStyles = '';
    Array.from(document.styleSheets).forEach((sheet) => {
        try {
            Array.from(sheet.cssRules || []).forEach((rule) => {
                cssStyles += rule.cssText;
            });
        } catch (e) {
            // Игнорируем внешние стили с политикой CORS
        }
    });

    // 2. Клонируем HTML элемента, чтобы удалить из него кнопки перед отправкой
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.contentElement.nativeElement.innerHTML;

    // Удаляем все кнопки (button, mat-button, элементы с атрибутом (click) и т.д.)
    const buttons = tempDiv.querySelectorAll('button, .mat-mdc-button, [role="button"]');
    buttons.forEach((button) => button.remove());

    const contentHtml = tempDiv.innerHTML;

    // 3. Формируем итоговый HTML с нужным цветом фона (#353535) и скрытием кнопок
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                ${cssStyles}
                
                /* Устанавливаем цвет фона для всего документа */
                html, body {
                    background-color: #353535 !important;
                    color: #ffffff; /* Цвет текста по умолчанию для темного фона */
                    margin: 0;
                    padding: 20px;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                /* Гарантируем скрытие любых оставшихся кнопок */
                button, 
                .mat-mdc-button, 
                .mat-mdc-outlined-button, 
                .no-print {
                    display: none !important;
                }
            </style>
        </head>
        <body>
            ${contentHtml}
        </body>
        </html>
    `;

    // 4. Отправляем и скачиваем PDF
    this.pdfService.exportPdf(fullHtml).subscribe({
        next: (res: any) => {
            const base64Pdf = res.data?.exportPdf;
            if (base64Pdf) {
                this.downloadPdfFromBase64(base64Pdf, 'document.pdf');
            }
            this.exportLock.set(false);
        },
        error: (err) => {
            console.error('Ошибка экспорта:', err);
            this.exportLock.set(false);
        }
    });
}

    private downloadPdfFromBase64(base64Data: string, fileName: string = 'document.pdf'): void {
        // 1. Очищаем строку, если бэкенд присылает префикс data:application/pdf;base64,
        const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');

        // 2. Декодируем Base64 в бинарную строку
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // 3. Создаем Blob с типом PDF
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // 4. Создаем ссылку и инициируем скачивание
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        // 5. Очищаем ресурсы
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    }

    displayedColumns: string[] = ['category', 'skills', 'experience', 'lastUsed'];

    cvId = input.required<string>();
    cv = signal<Cv>({} as Cv);

    skillsCategories = signal<SkillCategory[]>([]);
    skills = signal<SkillMastery[]>([]);

    ngOnInit() {
        this.cvsService.getCvById(this.cvId()).subscribe((res) => {
            if (res.data?.cv) {
                this.cv.set(res.data.cv);
                console.log('cv', this.cv());

                this.skillsService.getSkillsById(Number(this.cv().user?.id)).subscribe((res) => {
                    if (res.data?.profile.skills) {
                        this.skills.set(res.data.profile.skills);
                    }
                });
            }
        });

        this.skillsService.getSkillsCategories().subscribe((res) => {
            if (res.data?.skillCategories) {
                this.skillsCategories.set(res.data?.skillCategories);
            }
            console.log('categories: ', res.data?.skillCategories);
        });
    }
}
