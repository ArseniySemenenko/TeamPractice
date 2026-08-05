import { Service, inject, signal } from '@angular/core';
import { JwtService } from './jwt-service';
import { Apollo, gql } from 'apollo-angular';
import { UpdateTokenResult } from 'cv-graphql';
import { tap } from 'rxjs';

const UPDATE_TOKENS = gql`
    mutation UpdateTokens {
        updateToken {
            access_token
            refresh_token
        }
    }
`;

@Service()
export class TokensService {
    private readonly jwt = inject(JwtService);
    private readonly apollo = inject(Apollo);

    private _accessToken = signal('');
    private _refreshToken = signal('');

    readonly accessToken = this._accessToken.asReadonly();
    readonly refreshToken = this._refreshToken.asReadonly();

    setTokens(access: string, refresh: string) {
        this._accessToken.set(access);
        this._refreshToken.set(refresh);
    }

    updateTokens() {
        console.log(this._refreshToken());
        this.apollo
            .mutate<{updateToken: UpdateTokenResult}>({
                mutation: UPDATE_TOKENS,
                context: {
                    headers: {
                        Authorization: this._refreshToken() ? `Bearer ${this._refreshToken()}` : '',
                        'X-UPDATE': 'true',
                    },
                },
            })
            .pipe(
                tap((res) => {
                    const tokens = res.data?.updateToken;
                    if (tokens) {
                        this._accessToken.set(tokens.access_token);
                        this._refreshToken.set(tokens.refresh_token);
                    }
                    console.log('access token: ', this._accessToken());
                    console.log('refresh token: ', this._refreshToken());
                }),
            )
            .subscribe();
    }

    //Check is exp == now, and update if need
    checkExpAndUpdate() {
        //do <=
        let exp = this.jwt.getTokenExpiry(this._accessToken());
        if (exp) {
            if (Number(exp) <= Number(Date.now())) {
                console.log('udpated tokens');
                this.updateTokens();
            }
        }
    }
}
