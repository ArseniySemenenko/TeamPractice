import { Component, inject, input, OnInit, signal } from '@angular/core';
import { LangsService } from '../../services/langs-service';
import { LanguageProficiency } from 'cv-graphql';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AddLangDialog } from '../add-lang-dialog/add-lang-dialog';
import { MatButtonModule } from '@angular/material/button';

import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { UpdateLangDialog } from '../update-lang-dialog/update-lang-dialog';

@Component({
    selector: 'app-langs-list',
    imports: [
        CommonModule,
        MatIconModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatButtonModule,
    ],
    templateUrl: './langs-list.html',
    styleUrl: './langs-list.css',
})
export class LangsList implements OnInit {
    private readonly langsService = inject(LangsService);
    readonly authService = inject(AuthService);
    private dialog = inject(MatDialog);

    userId = input<string>();
    langs = signal<LanguageProficiency[]>([]);

    langsToDelete = signal<LanguageProficiency[]>([]);
    isDeleteActive = signal(false);

    langDeleteClick(lang: LanguageProficiency) {
        if (this.langsToDelete().some((l) => l.name == lang.name)) {
            this.langsToDelete.update((langs) => langs.filter((l) => l.name != lang.name));
        } else {
            this.langsToDelete.update((langs) => [...langs, lang]);
        }
    }

    deleteLangs() {
        console.log(this.langsToDelete());
        this.langsService
            .deleteProfileLangs({
                userId: this.authService.currentUserId() ?? '',
                name: this.langsToDelete().map((l) => l.name),
            })
            .subscribe(() => {
                this.langs.update((langs) =>
                    langs.filter((lang) => !this.langsToDelete().some((l) => l.name == lang.name)),
                );
                this.isDeleteActive.set(false);
                this.langsToDelete.set([]);
            });
    }

    ngOnInit(): void {
        const id = this.userId() || this.authService.currentUserId();
        if (id) {
            this.langsService.getLangsById(id).subscribe((res) => {
                if (res.data?.profile.languages) {
                    this.langs.set(res.data.profile.languages);
                }
            });
        }
    }

    openUpdateLangDialog(lang: LanguageProficiency) {
        const dialogRef = this.dialog.open(UpdateLangDialog, {
            width: '500px',
            disableClose: true,
            data: {
                lang: lang,
            },
        });

        dialogRef.afterClosed().subscribe((result: { lang: LanguageProficiency } | undefined) => {
            if (result) {
                console.log('Updated lang:', result);

                this.langsService
                    .updateProfileLang({
                        userId: this.authService.currentUserId() ?? '',
                        name: result.lang.name,
                        proficiency: result.lang.proficiency,
                    })
                    .subscribe((res) => {
                        if (res.data?.updateProfileLanguage.languages) {
                            this.langs.set(res.data?.updateProfileLanguage.languages);
                        }
                    });
            }
        });
    }

    openAddLangDialog() {
        const dialogRef = this.dialog.open(AddLangDialog, {
            width: '500px',
            disableClose: true,
            data: {
                langs: this.langs(),
            },
        });

        dialogRef.afterClosed().subscribe((result: { lang: LanguageProficiency }) => {
            if (result) {
                console.log('added lang: ', result);

                this.langsService
                    .addProfileLang({
                        userId: this.authService.currentUserId() ?? '',
                        name: result.lang.name,
                        proficiency: result.lang.proficiency,
                    })
                    .subscribe({
                        next: (res) => {
                            console.log('add lang res: ', res.data?.addProfileLanguage);
                            if (res.data?.addProfileLanguage.languages) {
                                this.langs.set(res.data?.addProfileLanguage.languages);
                            }
                        },
                        error: (err) => console.log(err),
                    });
            }
        });
    }
}
