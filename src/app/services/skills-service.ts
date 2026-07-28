import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Skill, SkillCategory } from 'cv-graphql';
import { Profile } from 'cv-graphql';
import { SkillMastery } from 'cv-graphql';
import { signal } from '@angular/core';
import { AddProfileSkillInput } from 'cv-graphql';
import { map } from 'rxjs/operators';
import { first } from 'rxjs';

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

const DeleteProfileSkill = gql`
    mutation DeleteProfileSkill($args: DeleteProfileSkillInput!) {
        deleteProfileSkill(skill: $args) {
            id
        }
    }
`;

const UpdateProfileSkill = gql`
    mutation UpdateProfileSkill($args: UpdateProfileSkillInput!) {
        updateProfileSkill(skill: $args) {
            id
        }
    }
`;

@Service()
export class SkillsService {
    private readonly apollo = inject(Apollo);

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

    deleteProfileSkills(id: string, names: string[]) {
        return this.apollo.mutate<{ deleteProfileSkill: { id: string } }>({
            mutation: DeleteProfileSkill,
            variables: {
                args: {
                    userId: id,
                    name: names,
                },
            },
        });
    }

    updateProfileSkill(id: string , skill: SkillMastery) {
        return this.apollo.mutate<{ updateProfileSkill: { id: string } }>({
            mutation: UpdateProfileSkill,
            variables: {
                args: {
                    userId: id,
                    name: skill.name,
                    categoryId: skill.categoryId,
                    mastery: skill.mastery,
                },
            },
        });
    }
}
