import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from 'cv-graphql';
import { UserRole } from 'cv-graphql';
import { Profile } from 'cv-graphql';

const GetUsersAsEmployees = gql`
    query GetUsersAsEmployees {
        users {
            id
            email
            profile {
                first_name
                last_name
                avatar
            }
            department_name
            position_name
        }
    }
`;

const GetUser = gql`
    query GetUser($userId: ID!) {
        user(userId: $userId) {
            id
            created_at
            email
            is_verified
            profile {
                id
                created_at
                first_name
                last_name
                full_name
                avatar
                skills {
                    name
                    categoryId
                    mastery
                }
                languages {
                    name
                    proficiency
                }
            }
            department {
                id
                created_at
                name
            }
            department_name
            position {
                id
                created_at
                name
            }
            position_name
            role
        }
    }
`;

const UpdateProfile = gql`
    mutation UpdateProfile($profile: UpdateProfileInput!) {
        updateProfile(profile: $profile) {
            id
            created_at
            first_name
            last_name
            full_name
            avatar
            skills {
                name
                categoryId
                mastery
            }
            languages {
                name
                proficiency
            }
        }
    }
`;

const UpdateUser = gql`
    mutation updateUser($user: UpdateUserInput!) {
        updateUser(user: $user) {
            id
            created_at
            email
            is_verified
            profile {
                id
                created_at
                first_name
                last_name
                full_name
                avatar
                skills {
                    name
                    categoryId
                    mastery
                }
                languages {
                    name
                    proficiency
                }
            }
            department {
                id
                name
                created_at
            }
            department_name
            position {
                id
                created_at
                name
            }
            position_name
        }
    }
`;

interface getEmployeesRes {
    users: Employee[];
}
export interface Employee {
    id: string;
    email: string;
    profile: {
        first_name: string;
        last_name: string;
        avatar: string;
    };
    department_name: string;
    position_name: string;
}

@Service()
export class UsersService {
    private readonly apollo = inject(Apollo);

    getEmployees() {
        return this.apollo.query<getEmployeesRes>({
            query: GetUsersAsEmployees,
        });
    }

    getUser(id: number) {
        return this.apollo.query<{ user: User }>({
            query: GetUser,
            variables: {
                userId: id,
            },
        });
    }

    updateProfile(id: string, f_name: string, l_name: string) {
        return this.apollo.mutate<{ updateProfile: Profile }>({
            mutation: UpdateProfile,
            variables: {
                profile: {
                    userId: id,
                    first_name: f_name,
                    last_name: l_name,
                },
            },
        });
    }

    updateUser(id: string, depId: string  , positionId: string , role: UserRole){
        return this.apollo.mutate<{updateUser: User}>({
            mutation: UpdateUser,
            variables: {
                user: {
                    userId: id,
                    cvsIds: [],
                    departmentId: depId,
                    positionId: positionId,
                    role: role,
                }
            }
        })
    }
}
