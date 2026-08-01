import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { AuthService } from '../../services/auth-service';
import { Cv, SkillCategory } from 'cv-graphql';
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
import { CvsService } from '../../services/cvs-service';

@Component({
    selector: 'app-cv-skills',
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
    templateUrl: './cv-skills.html',
    styleUrl: './cv-skills.css',
})
export class CvSkills implements OnInit{
    private readonly skilsService = inject(SkillsService);
    private readonly cvsService = inject(CvsService);

    readonly authService = inject(AuthService);

    private dialog = inject(MatDialog);

    userId = signal("610"); //...............

    currentCv = signal<Cv>({} as Cv);

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

    //ПЕРЕДЕЛАТЬ
    deleteSkills() {
        this.cvsService.deleteCvSkills({
            cvId: this.cvId(),
            name: this.skillsToDelete().map((s) => s.name),
        })
        .subscribe((res) => {
          console.log('delete skills res: ', res.data?.deleteCvSkill);
          if(res.data?.deleteCvSkill.skills){
            this.skills.set(res.data.deleteCvSkill.skills);
          }
          
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

    cvId = input.required<string>();

    ngOnInit() {


        this.cvsService.getCvProfileById(this.cvId())
        .subscribe((res) => {
            if(res.data?.cv){
                this.currentCv.set(res.data.cv);
            }
        })

        //SKILLS CATEGORIES

        this.skilsService.getSkillsCategories().subscribe((res) => {
            if (res.data?.skillCategories) {
                this.skillsCategories.set(res.data?.skillCategories);
            }
            console.log('categories: ', res.data?.skillCategories);
        });

        //if user == currentUser
        //skills
        if (this.cvId()) {
            this.cvsService
                .getCvSkills(this.cvId())
                .subscribe((skills) => {
                    if (skills.data?.cv.skills) {
                        this.skills.set(skills.data?.cv.skills);
                    }
                    console.log(
                        'get skills by id: ',
                        this.cvId(),
                        this.skills(),
                    );
                });
        }
    }


    
    openUpdateSkillDialog(skill: SkillMastery): void {
      if(this.currentCv().user?.email != this.authService.currentUser().email) {
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

          this.cvsService.updateCvSkill({
            cvId: this.cvId(),
            name: result.skill.name,
            categoryId: result.skill.categoryId,
            mastery: result.skill.mastery,
          })
          .subscribe({
            next: (res) => {
                if(res.data?.updateCvSkill.skills){
                    this.skills.set(res.data.updateCvSkill.skills);
                }
            },
            error: (err) => console.log(err),
          })
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

                this.cvsService.addCvSkill({
                        cvId: this.cvId(),
                        name: result.skill.name,
                        categoryId: result.skill.categoryId,
                        mastery: result.skill.mastery,
                })
                .subscribe({
                    next: (res) => {
                        console.log('add skill res: ', res.data?.addCvSkill.skills);
                        if(res.data?.addCvSkill.skills){
                            this.skills.set(res.data?.addCvSkill.skills);
                        }
                    },
                    error: (err) => console.log(err),
                });

                /*
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
                    });*/
            }
        });
    }
}
