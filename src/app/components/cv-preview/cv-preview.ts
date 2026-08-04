import { Component, inject, input, OnInit, signal, computed } from '@angular/core';
import { SkillMastery } from 'cv-graphql';
import { Cv } from 'cv-graphql';
import { CvsService } from '../../services/cvs-service';
import { SkillCategory } from 'cv-graphql';
import { SkillsService } from '../../services/skills-service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Skill } from 'cv-graphql';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-cv-preview',
    imports: [MatTableModule , MatButtonModule],
    templateUrl: './cv-preview.html',
    styleUrl: './cv-preview.css',
})
export class CvPreview implements OnInit {
    private readonly cvsService = inject(CvsService);
    private readonly skillsService = inject(SkillsService);

    displayedColumns: string[] = ['category', 'skills', 'experience', 'lastUsed'];

    cvId = input.required<string>();
    cv = signal<Cv>({} as Cv);

    skillsCategories = signal<SkillCategory[]>([]);
    skills = signal<SkillMastery[]>([]);

    ngOnInit() {
        this.cvsService.getCvById(this.cvId()).subscribe((res) => {
            if (res.data?.cv) {
                this.cv.set(res.data.cv);
                console.log('cv' , this.cv());

                this.skillsService.getSkillsById(Number(this.cv().user?.id))
                .subscribe((res) => {
                    if(res.data?.profile.skills){
                        this.skills.set(res.data.profile.skills);
                    }
                })
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
