import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { UploadAvatarInput } from 'cv-graphql';

const UploadAvatar = gql`
    mutation UploadAvatar($args: UploadAvatarInput!) {
        uploadAvatar(avatar: $args)
    }
`;

@Service()
export class UploadService {

    private readonly apollo = inject(Apollo);

    uploadAvatar(args: UploadAvatarInput){
        return this.apollo.mutate({
            mutation: UploadAvatar,
            variables: {
                args: args,
            },
        })
    }
}
