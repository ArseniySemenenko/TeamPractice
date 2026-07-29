import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { AuthService } from '../../services/auth-service';
import { SkillCategory } from 'cv-graphql';
import { SkillMastery } from 'cv-graphql';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddSkillDialog, SkillData } from '../add-skill-dialog/add-skill-dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpdateSkillDialog } from '../update-skill-dialog/update-skill-dialog';

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
        MatButtonModule,
    ],
    templateUrl: './skills-list.html',
    styleUrl: './skills-list.css',
})
export class SkillsList implements OnInit {
    private readonly skilsService = inject(SkillsService);
    readonly authService = inject(AuthService);

    private dialog = inject(MatDialog);

    isDeleteActive = signal(false);
    skillsToDelete = signal<SkillMastery[]>([]);

    skillClickDelete(skill: SkillMastery) {
        if (this.skillsToDelete().some((s) => s.name === skill.name)) {
            this.skillsToDelete.update((skills) => skills.filter((s) => s.name !== skill.name));
            console.log('skillsToDelete after removal: ', this.skillsToDelete());
        } else {
            this.skillsToDelete.update((skills) => [...skills, skill]);
            console.log('skillsToDelete after addition: ', this.skillsToDelete());
        }
    }

    deleteSkills() {
        this.skilsService.deleteProfileSkills(this.authService.currentUserId() ?? '', this.skillsToDelete().map((s) => s.name))
        .subscribe((res) => {
          console.log('delete skills res: ', res.data?.deleteProfileSkill);
          this.skills.update((skills) => skills.filter((s) => !this.skillsToDelete().some((sd) => sd.name === s.name)));
          this.isDeleteActive.set(false);
          this.skillsToDelete.set([]);
        })

    }


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


    //
    openUpdateSkillDialog(skill: SkillMastery): void {

      if((this.userId() && this.userId() != this.authService.currentUserId())) {
        return;
      }
      const dialogRef = this.dialog.open(UpdateSkillDialog , {
        width: '500px',
        disableClose: true,
        data: {
          skill: skill,
        },
      });

      dialogRef.afterClosed().subscribe((result: SkillData | undefined) => {
        if (result) {
          console.log('Updated skill:', result);

          this.skilsService
            .updateProfileSkill(this.authService.currentUserId() ?? '', result.skill)
            .subscribe({
              next: (res) => {
                console.log('update skill res: ', res.data?.updateProfileSkill);
                this.skills.update((skills) => skills.map(s => s.name === result.skill.name ? result.skill : s));
              },
              error: (err) => console.log(err),
            });
        }
      });
    }

    openAddSkillDialog(): void {
        const dialogRef = this.dialog.open(AddSkillDialog, {
            width: '500px',
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
