import { Service , inject , signal } from '@angular/core';
import { JwtService } from './jwt-service';
import { Apollo , gql } from 'apollo-angular';
import { UpdateTokenResult } from 'cv-graphql';
import { tap } from 'rxjs';


const UPDATE_TOKENS = gql`
    mutation UpdateTokens{
        updateToken{
            access_token
            refresh_token
        }
    }
`



@Service()
export class TokensService {
    private readonly jwt = inject(JwtService);
    private readonly apollo = inject(Apollo);

    private _accessToken = signal("");
    private _refreshToken = "";

    getAccesToken(){
        return this._accessToken();
    }

    setTokens(access: string , refresh: string){
        this._accessToken.set(access);
        this._refreshToken = refresh;
    }

    updateTokens(){
        this.apollo.mutate<UpdateTokenResult>({
            mutation: UPDATE_TOKENS,
            context: {
                headers: {
                    Authorization: this._refreshToken ? `Bearer ${this._refreshToken}` : '',
                    'X-UPDATE' : "true",
                }
            }
        })
        .pipe(
            tap((res) => {
                if(res.data){
                    this._accessToken.set(res.data.access_token);
                    this._refreshToken = res.data.refresh_token;
                }
            })
        )
    }

    //Check is exp == now, and update if need
    checkExpAndUpdate(){
        //do <=
        let exp = this.jwt.getTokenExpiry(this._accessToken());
        if(exp){
            if(exp <= Date.now()){
                console.log('udpated tokens');
                this.updateTokens();
            }
        }
    }
}
