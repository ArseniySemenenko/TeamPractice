import { Service , computed, inject , signal } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo , gql } from 'apollo-angular';
import type { AuthInput, AuthResult, ForgotPasswordInput} from 'cv-graphql';
import { Observable , map , tap} from 'rxjs';


export type LoginArgs = { auth: AuthInput };
export type LoginResult = { login: AuthResult };

export type SignupArgs = { auth: AuthInput };
export type SignupResult = { signup: AuthResult };


export const LOGIN = gql`
  query Login($auth: AuthInput!) {
  login(auth: $auth) {
    access_token
    
    
    refresh_token
    user {
      id
      email
    }
  }
}
`;

export const SIGNUP = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user { id email }
      access_token
    }
  }
`;

export const FORGOT = gql`
  mutation Forgot($auth:ForgotPasswordInput!){
  forgotPassword(auth: $auth)
}
`;

@Service()
export class AuthService {
    private readonly apollo = inject(Apollo);
    private readonly router = inject(Router);

    private _accessToken = signal<string | null>(null);
    private _currentUser = signal<any | null>(null);

    readonly accessToken = this._accessToken.asReadonly();
    readonly currentUser = this._currentUser.asReadonly();

    readonly isAuth = computed(() => this._accessToken());

    login(args: AuthInput): Observable<LoginResult>{
        return this.apollo.query<LoginResult , LoginArgs>({
            query: LOGIN,
            variables: { auth: args },
            fetchPolicy: 'network-only',
        })
        .pipe(
            map((response) => {
                if (!response.data || !response.data.login) {
                    throw new Error('Signup failed: Server returned empty data');
                }
                return response.data; 
            }),
            tap((authResult) => console.log(authResult))
      );
    }

    signup(auth: SignupArgs['auth']): Observable<any> {
        return this.apollo.mutate<SignupResult>({
            mutation: SIGNUP,
            variables: {auth: auth},
        })
        .pipe(
            map((response) => {
                if (!response.data || !response.data.signup) {
                    throw new Error('Signup failed: Server returned empty data');
                }
                return response.data; 
            }),
            tap((authResult) => console.log(authResult))
      );
    }

    forgot(auth: ForgotPasswordInput): Observable<void>{
        return this.apollo.mutate<void>({
            mutation: FORGOT,
            variables: { auth },
        })
        .pipe(
            map((response) => {
                return response.data; 
            }),
            tap((authResult) => console.log(authResult))
      );
    }
}
