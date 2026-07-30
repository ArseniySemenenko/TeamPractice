import { Service, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateCvInput, Cv, DeleteCvInput } from 'cv-graphql';

const GetCvsToTable = gql`
    query GetUser($userId: ID!) {
        user(userId: $userId) {
            cvs {
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

@Service()
export class CvsService {
    private readonly apollo = inject(Apollo);

    getCvsToTable(userId: string) {
        return this.apollo.query<{ user: { cvs: Cv[] } }>({
            query: GetCvsToTable,
            variables: { userId },
        });
    }

    createCv(args: CreateCvInput) {
        return this.apollo.mutate<{ createCv: Cv }>({
            mutation: CreateCv,
            variables: { args: args },
        });
    }

    deleteCvById(args: DeleteCvInput){
        return this.apollo.mutate<{deleteCv: {affected: number}}>({
            mutation: DeleteCvById,
            variables: {
                args: args,
            }
        })
    }
}
