import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { AuthService } from '../../services/auth-service';
import { Skill, SkillCategory } from 'cv-graphql';

@Component({
    selector: 'app-skills-list',
    imports: [],
    templateUrl: './skills-list.html',
    styleUrl: './skills-list.css',
})
export class SkillsList implements OnInit {
    private readonly skilsService = inject(SkillsService);
    private readonly authService = inject(AuthService);

    skills = signal<
        {
            name: string;
            categoryId: string;
            mastery: 'Novice' | 'Advanced' | 'Competent' | 'Proficient' | 'Expert';
        }[]
    >([]);
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
        if (this.userId() || this.authService.currentUserId())
            this.skilsService
                .getSkillsById(Number(this.userId() || this.authService.currentUserId()))
                .subscribe((skills) => {
                    if (skills.data?.profile) {
                        this.skills.set(skills.data?.profile.skills);
                    }
                    console.log('skills: ', this.skills());
                });
    }
}
