import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Skill } from 'cv-graphql';

const GetSkillsById = gql`
    query GetsSkillsById($userId: ID!){
        profile(userId: $userId){
            skills{
                name
                categoryId
                mastery
            }
        }
    }
`

@Service()
export class SkillsService {
    private readonly apollo = inject(Apollo);

    getSkillsById(id: number){
        return this.apollo.query<{ profile: { skills: Skill[] } }>({
            query: GetSkillsById,
            variables: {
                userId: id,
            }
        })
    }

}
