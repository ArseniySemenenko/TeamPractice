import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Department } from 'cv-graphql';

const GetDepartments = gql`
    query GetDepartments {
        departments {
            id
            created_at
            name
        }
    }
`;

@Service()
export class DepService {

    private readonly apollo = inject(Apollo);

    getDepartments() {
        return this.apollo.query<{departments: Department[]}>({
            query: GetDepartments
        })
    }
}
