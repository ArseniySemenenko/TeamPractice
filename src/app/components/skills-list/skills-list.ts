import { Component , inject, OnInit, signal } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { AuthService } from '../../services/auth-service';
import { Skill } from 'cv-graphql';

@Component({
  selector: 'app-skills-list',
  imports: [],
  templateUrl: './skills-list.html',
  styleUrl: './skills-list.css',
})
export class SkillsList implements OnInit{

  private readonly skilsService = inject(SkillsService);
  private readonly authService = inject(AuthService);

  skills = signal<Skill[]>([]);

  ngOnInit(){
    //if user == currentUser
    let id = this.authService.currentUserId()
    //skills
    if(id) this.skilsService.getSkillsById(Number(id))
    .subscribe((skills) => {
          if(skills.data?.profile){
            this.skills.set(skills.data?.profile.skills);
          }

          console.log(this.skills());
    })
  }
}
