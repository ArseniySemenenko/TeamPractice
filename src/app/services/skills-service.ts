import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Skill, SkillCategory } from 'cv-graphql';
import { Profile } from 'cv-graphql';

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

interface GroupedCategory {
    id: string;
    name: string;
    order: number;
    // Навыки, принадлежащие непосредственно этой категории
    skills: Skill[];
    // Подкатегории с их навыками
    subcategories: {
        id: string;
        name: string;
        order: number;
        skills: Skill[];
    }[];
}

@Service()
export class SkillsService {
    private readonly apollo = inject(Apollo);

    getSkillsById(id: number) {
        return this.apollo.query<{
            profile: {
                skills: {
                    name: string;
                    categoryId: string;
                    mastery: "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert",
                }[];
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

    groupSkills(categories: SkillCategory[], skills: Skill[]): GroupedCategory[] {
        // 1. Исправлено: используем skill.categoryId вместо skill.id
        const skillsByCategoryId = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
            const catId = skill.id;
            if (!acc[catId]) {
                acc[catId] = [];
            }
            acc[catId].push(skill);
            return acc;
        }, {});

        // 2. Берём корневые категории
        const rootCategories = categories
            .filter((cat) => cat.parent === null)
            .sort((a, b) => a.order - b.order);

        // 3. Формируем структуру
        return rootCategories
            .map((root) => {
                const rootSkills = skillsByCategoryId[root.id] || [];

                const subcategories = (root.children || [])
                    .map((child) => ({
                        id: child.id,
                        name: child.name,
                        order: child.order,
                        skills: skillsByCategoryId[child.id] || [],
                    }))
                    .filter((sub) => sub.skills.length > 0)
                    .sort((a, b) => a.order - b.order);

                return {
                    id: root.id,
                    name: root.name,
                    order: root.order,
                    skills: rootSkills,
                    subcategories,
                };
            })
            .filter((group) => group.skills.length > 0 || group.subcategories.length > 0);
    }
}
