import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AddProfileLanguageInput, DeleteProfileLanguageInput, Language, LanguageProficiency } from 'cv-graphql';

const GetLangsById = gql`
    query GetLangsById($userId: ID!) {
        profile(userId: $userId) {
            languages {
                name
                proficiency
            }
        }
    }
`;

const GetAllLangs = gql`
    query GetAllLangs {
        languages {
            id
            name
            native_name
        }
    }
`;

const AddProfileLang = gql`
    mutation AddProfileLanguage($args: AddProfileLanguageInput!) {
        addProfileLanguage(language: $args) {
            id
            languages {
                name
                proficiency
            }
        }
    }
`;

const DeleteProfileLang = gql`
    mutation DeleteProfileLang($args: DeleteProfileLanguageInput!) {
        deleteProfileLanguage(language: $args) {
            id
        }
    }
`;

@Service()
export class LangsService {
    private readonly apollo = inject(Apollo);

    getLangsById(id: string) {
        return this.apollo.query<{ profile: { languages: LanguageProficiency[] } }>({
            query: GetLangsById,
            variables: {
                userId: id,
            },
        });
    }

    getAllLangs() {
        return this.apollo.query<{ languages: Language[] }>({
            query: GetAllLangs,
        });
    }

    addProfileLang(args: AddProfileLanguageInput) {
        return this.apollo.mutate<{
            addProfileLanguage: { id: string; languages: LanguageProficiency[] };
        }>({
            mutation: AddProfileLang,
            variables: {
                args: args,
            },
        });
    }

    deleteProfileLangs(args: DeleteProfileLanguageInput) {
        return this.apollo.mutate<{deleteProfileLanguage: {id: string}}>({
            mutation: DeleteProfileLang,
            variables: {
                args: args,
            }
        })
    }
}
