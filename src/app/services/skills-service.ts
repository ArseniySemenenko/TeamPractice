import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Skill, SkillCategory } from 'cv-graphql';
import { Profile } from 'cv-graphql';
import { SkillMastery } from 'cv-graphql';
import { signal } from '@angular/core';
import { AddProfileSkillInput } from 'cv-graphql';

const GetSkillsById = gql`
    query GetsSkillsById($userId: ID!) {
        profile(userId: $userId) {
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

const GetSkillsCategories = gql`
    query GetSkillsCategories {
        skillCategories {
            id
            name
            order
            parent {
                id
                name
                order
            }
            children {
                id
                name
                order
            }
        }
    }
`;

const GetAllSkills = gql`
    query GetAllSkills {
        skills {
            id
            name
            category {
                name
                id
            }
        }
    }
`;

const AddProfileSkill = gql`
    mutation AddProfileSkill($skill: AddProfileSkillInput!) {
        addProfileSkill(skill: $skill) {
            id
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

@Service()
export class SkillsService {
    private readonly apollo = inject(Apollo);

    currentUserSkills = signal<SkillMastery[]>([]);

    // Общее состояние
    private skillsSignal = signal<SkillMastery[]>([]);
    private categoriesSignal = signal<SkillCategory[]>([]);

    // Публичные readonly сигналы
    readonly skills = this.skillsSignal.asReadonly();
    readonly skillCategories = this.categoriesSignal.asReadonly();

   

    //
    getSkillsById(id: number) {
        return this.apollo.query<{
            fetchPolicy: 'no-cache';
            profile: {
                skills: SkillMastery[];
            };
        }>({
            query: GetSkillsById,
            variables: {
                userId: id,
            },
        });
    }

    getSkillsCategories() {
        return this.apollo.query<{ skillCategories: SkillCategory[] }>({
            query: GetSkillsCategories,
        });
    }

    getAllSkills() {
        return this.apollo.query<{ skills: Skill[] }>({
            query: GetAllSkills,
        });
    }

    addProfileSkill(args: AddProfileSkillInput) {
        return this.apollo.mutate<{ addProfileSkill: { id: string; skills: SkillMastery[] } }>({
            mutation: AddProfileSkill,
            variables: {
                skill: args,
            },
        });
    }
}
