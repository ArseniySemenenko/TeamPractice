import { Service, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { AddCvProjectInput, Project, UpdateCvProjectInput } from 'cv-graphql';
import { CvProject } from 'cv-graphql';
import { RemoveCvProjectInput } from 'cv-graphql';

const GetAllProjects = gql`
    query GetAllProjects {
        projects {
            id
            created_at
            name
            internal_name
            domain
            start_date
            end_date
            description
            environment
        }
    }
`;

const AddCvProject = gql`
    mutation AddCvProject($args: AddCvProjectInput!) {
        addCvProject(project: $args) {
            projects {
                project {
                    id
                }
                id
                name
                internal_name
                description
                domain
                start_date
                end_date
                environment
                roles
                responsibilities
            }
        }
    }
`;

const GetCvProjects = gql`
    query GetCvProjects($args: ID!) {
        cv(cvId: $args) {
            projects {
                project {
                    id
                }
                id
                name
                internal_name
                description
                domain
                start_date
                end_date
                environment
                roles
                responsibilities
            }
        }
    }
`;

const DeleteCvProject = gql`
    mutation DeleteCvProject($args: RemoveCvProjectInput!) {
        removeCvProject(project: $args) {
            projects {
                project {
                    id
                }
                id
                name
                internal_name
                description
                domain
                start_date
                end_date
                environment
                roles
                responsibilities
            }
        }
    }
`;

const UpdateCvProject = gql`
    mutation UpdateCvProject($args: UpdateCvProjectInput!) {
        updateCvProject(project: $args) {
            projects {
                project {
                    id
                }
                id
                name
                internal_name
                description
                start_date
                end_date
                roles
                responsibilities
            }
        }
    }
`;

@Service()
export class ProjectsService {
    private readonly apollo = inject(Apollo);

    updateCvProject(args: UpdateCvProjectInput) {
        return this.apollo.mutate<{ updateCvProject: { projects: CvProject[] } }>({
            mutation: UpdateCvProject,
            variables: {
                args,
            },
        });
    }

    deleteCvProject(args: RemoveCvProjectInput) {
        return this.apollo.mutate<{ removeCvProject: { projects: CvProject[] } }>({
            mutation: DeleteCvProject,
            variables: {
                args,
            },
        });
    }

    addCvProject(args: AddCvProjectInput) {
        return this.apollo.mutate<{ addCvProject: { projects: CvProject[] } }>({
            mutation: AddCvProject,
            variables: {
                args,
            },
        });
    }

    getCvProjects(cvId: string) {
        return this.apollo.query<{ cv: { projects: CvProject[] } }>({
            query: GetCvProjects,
            variables: {
                args: cvId,
            },
        });
    }

    getAllProjects() {
        return this.apollo.query<{ projects: Project[] }>({
            query: GetAllProjects,
        });
    }
}
