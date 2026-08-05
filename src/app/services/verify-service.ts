import { Service , inject } from '@angular/core';
import { Apollo , gql } from 'apollo-angular';
import { VerifyMailInput } from 'cv-graphql';

const VerifyMail = gql`
    mutation verifyMail($args: VerifyMailInput!) {
        verifyMail(mail: $args)
    }
`;

@Service()
export class VerifyService {

    private readonly apollo = inject(Apollo);
    token = localStorage.getItem('access');

    verifyMail(args: VerifyMailInput){
        console.log(this.token);
        return this.apollo.mutate({
            mutation: VerifyMail,
            variables: {
                args: args,
                
            },
            context: {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                },
        });
    }
}
