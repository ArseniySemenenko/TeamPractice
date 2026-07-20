import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from 'cv-graphql';

const GetUsersAsEmployees = gql`
    query GetUsersAsEmployees {
        users {
            id
            email
            profile{
                first_name
                last_name
                avatar
            }
            department_name
            position_name
        }
    }
`

interface getEmployeesRes{
    users: Employee[],
}
export interface Employee{
    id: number,
    email:string,
    profile: {
        first_name: string,
        last_name: string,
        avatar: string,
    },
    department_name: string,
    position_name: string,
}

@Service()
export class UsersService {

    private readonly apollo = inject(Apollo);

    getEmployees(){
        return this.apollo.query<getEmployeesRes>({
            query: GetUsersAsEmployees,
        })
    }

}
