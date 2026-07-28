import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { AuthService } from '../../services/auth-service';
import { Skill, SkillCategory } from 'cv-graphql';
import { SkillMastery } from 'cv-graphql';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddSkillDialog, SkillData } from '../add-skill-dialog/add-skill-dialog';
import { SimpleChanges } from '@angular/core';

import {
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';

@Component({
    selector: 'app-skills-list',
    imports: [
        MatProgressBarModule,
        CommonModule,
        MatIconModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
    ],
    templateUrl: './skills-list.html',
    styleUrl: './skills-list.css',
})
export class SkillsList implements OnInit {
    private readonly skilsService = inject(SkillsService);
    private readonly authService = inject(AuthService);
    private dialog = inject(MatDialog);

    skills = signal<SkillMastery[]>([]);

    masteryValues: Record<'Novice' | 'Advanced' | 'Competent' | 'Proficient' | 'Expert', number> = {
        Novice: 20,
        Advanced: 40,
        Competent: 60,
        Proficient: 80,
        Expert: 100,
    };

    masteryColors: Record<'Novice' | 'Advanced' | 'Competent' | 'Proficient' | 'Expert', string> = {
        Novice: 'gray',
        Advanced: 'blue',
        Competent: 'green',
        Proficient: 'yellow',
        Expert: 'red',
    };

    skillsCategories = signal<SkillCategory[]>([]);

    userId = input();

    ngOnInit() {
        //SKILLS CATEGORIES

        this.skilsService.getSkillsCategories().subscribe((res) => {
            if (res.data?.skillCategories) {
                this.skillsCategories.set(res.data?.skillCategories);
            }
            console.log('categories: ', res.data?.skillCategories);
        });

        //if user == currentUser
        //skills
        if (this.userId() || this.authService.currentUserId()) {
            this.skilsService
                .getSkillsById(Number(this.userId() || this.authService.currentUserId()))
                .subscribe((skills) => {
                    if (skills.data?.profile) {
                        this.skills.set(skills.data?.profile.skills);
                    }
                    console.log(
                        'get skills by id: ',
                        this.userId() || this.authService.currentUserId(),
                        this.skills(),
                    );
                });
        }
    }

    openAddSkillDialog(): void {
        const dialogRef = this.dialog.open(AddSkillDialog, {
            width: '450px',
            disableClose: true,
            data: {
                skills: this.skills(),
            },
        });

        dialogRef.afterClosed().subscribe((result: SkillData | undefined) => {
            if (result) {
                console.log('Added skill:', result);

                this.skilsService
                    .addProfileSkill({
                        userId: this.authService.currentUserId() ?? '',
                        name: result.skill.name,
                        categoryId: result.skill.categoryId,
                        mastery: result.skill.mastery,
                    })
                    .subscribe({
                        next: (res) => {
                            console.log('add skill res: ', res.data?.addProfileSkill);
                            this.skills.update((skills) => [...skills, result.skill]);
                        },
                        error: (err) => console.log(err),
                    });
            }
        });
    }
}
