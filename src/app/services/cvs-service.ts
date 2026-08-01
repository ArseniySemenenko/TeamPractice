import { Service, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {
    AddCvSkillInput,
    CreateCvInput,
    Cv,
    DeleteCvInput,
    DeleteCvSkillInput,
    SkillMastery,
    UpdateCvInput,
    UpdateCvSkillInput,
} from 'cv-graphql';

const getCvs = gql`
    query GetCvs {
        cvs {
            id
            created_at
            name
            education
            description
            user {
                email
            }
        }
    }
`;

const CreateCv = gql`
    mutation CreateCv($args: CreateCvInput!) {
        createCv(cv: $args) {
            id
            name
            education
            description
            user {
                id
                email
            }
        }
    }
`;

const DeleteCvById = gql`
    mutation DeleteCvById($args: DeleteCvInput!) {
        deleteCv(cv: $args) {
            affected
        }
    }
`;

const GetCvProfileById = gql`
    query GetCvProfileById($id: ID!) {
        cv(cvId: $id) {
            id
            name
            education
            description
            user {
                id
                email
            }
        }
    }
`;

const UpdateCvProfileById = gql`
    mutation UpdateCvProfileById($args: UpdateCvInput!) {
        updateCv(cv: $args) {
            name
            education
            description
        }
    }
`;

const GetCvSkills = gql`
    query GetCvSkills($id: ID!) {
        cv(cvId: $id) {
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

const AddCvSkill = gql`
    mutation AddCvSkill($args: AddCvSkillInput!) {
        addCvSkill(skill: $args) {
            id
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

const UpdateCvSkill = gql`
    mutation UpdateCvSkill($args: UpdateCvSkillInput!) {
        updateCvSkill(skill: $args) {
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

const DeleteCvSkills = gql`
    mutation DeleteCvSkills($args: DeleteCvSkillInput!) {
        deleteCvSkill(skill: $args) {
            skills {
                name
                categoryId
                mastery
            }
        }
    }
`;

@Service()
export class CvsService {
    private readonly apollo = inject(Apollo);

    deleteCvSkills(args: DeleteCvSkillInput){
        return this.apollo.mutate<{deleteCvSkill: {skills: SkillMastery[]}}>({
            mutation: DeleteCvSkills,
            variables: {
                args: args,
            }
        })
    }

    updateCvSkill(args: UpdateCvSkillInput) {
        return this.apollo.mutate<{ updateCvSkill: { skills: SkillMastery[] } }>({
            mutation: UpdateCvSkill,
            variables: {
                args: args,
            },
        });
    }

    addCvSkill(args: AddCvSkillInput) {
        return this.apollo.mutate<{ addCvSkill: { id: string; skills: SkillMastery[] } }>({
            mutation: AddCvSkill,
            variables: {
                args: args,
            },
        });
    }

    getCvSkills(id: string) {
        return this.apollo.query<{ cv: { skills: SkillMastery[] } }>({
            query: GetCvSkills,
            variables: {
                id: id,
            },
        });
    }

    getCvs() {
        return this.apollo.query<{ cvs: Cv[] }>({
            query: getCvs,
        });
    }

    updateCvProfileById(args: UpdateCvInput) {
        return this.apollo.mutate<{ updateCv: Cv }>({
            mutation: UpdateCvProfileById,
            variables: {
                args: args,
            },
        });
    }

    getCvProfileById(id: string) {
        console.log(id);
        return this.apollo.query<{ cv: Cv }>({
            query: GetCvProfileById,
            variables: {
                id: id,
            },
        });
    }

    createCv(args: CreateCvInput) {
        return this.apollo.mutate<{ createCv: Cv }>({
            mutation: CreateCv,
            variables: { args: args },
        });
    }

    deleteCvById(args: DeleteCvInput) {
        return this.apollo.mutate<{ deleteCv: { affected: number } }>({
            mutation: DeleteCvById,
            variables: {
                args: args,
            },
        });
    }
}
