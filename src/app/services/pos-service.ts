import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Position } from 'cv-graphql';

const GetPositions = gql`
    query getPositions {
        positions {
            id
            created_at
            name
        }
    }
`;

@Service()
export class PosService {
    
    private readonly apollo = inject(Apollo);

    getPositions(){
        return this.apollo.query<{positions: Position[]}>({
            query: GetPositions,
        })
    }
}
