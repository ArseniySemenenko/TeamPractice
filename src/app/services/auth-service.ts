import { Service, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import type { AuthInput, AuthResult, ForgotPasswordInput } from 'cv-graphql';
import { Observable, map, tap } from 'rxjs';
import { JwtService } from './jwt-service';
import { TokensService } from './tokens-service';
import { User } from 'cv-graphql';
import { UsersService } from './users-service';

export type LoginArgs = { auth: AuthInput };
export type LoginResult = { login: AuthResult };

export type SignupArgs = { auth: AuthInput };
export type SignupResult = { signup: AuthResult };
import { ResetPasswordInput } from 'cv-graphql';

const resetPassword = gql`
    mutation ResetPassword($args: ResetPasswordInput!) {
        resetPassword(auth: $args)
    }
`;

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
            user {
                id
                email
            }
            access_token
        }
    }
`;

export const FORGOT = gql`
    mutation Forgot($auth: ForgotPasswordInput!) {
        forgotPassword(auth: $auth)
    }
`;

@Service()
export class AuthService {
    private readonly apollo = inject(Apollo);
    private readonly router = inject(Router);
    private readonly jwt = inject(JwtService);
    private readonly tokensService = inject(TokensService);
    private readonly usersService = inject(UsersService);

    private _currentUserId = signal<string | null>(null);

    readonly currentUserId = this._currentUserId.asReadonly();

    currentUser = signal<User>({} as User);
    currentUserPassword = signal('');

    readonly isAuth = computed(() => this.tokensService.accessToken() !== '');

    logOut() {
        this.tokensService.setTokens('', '');
        this.router.navigate(['auth', 'login']);
        console.log('log out');
    }

    resetPassword(args: ResetPasswordInput , token: string) {
        return this.apollo.mutate({
            mutation: resetPassword,
            context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-UPDATE': 'true', // Флаг для пропуска в интерцепторе
                    },
                },
                variables: {
                    args: args
                }
        })
    }

    login(args: AuthInput): Observable<LoginResult> {
        return this.apollo
            .query<LoginResult, LoginArgs>({
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
                tap((authResult) => {
                    console.log('isAuth: ', this.isAuth());
                    //this.accessToken.set(authResult.login.access_token);
                    this.tokensService.setTokens(
                        authResult.login.access_token,
                        authResult.login.refresh_token,
                    );

                    this._currentUserId.set(authResult.login.user.id);

                    if (this._currentUserId()) {
                        this.usersService.getUser(this._currentUserId() ?? '').subscribe((res) => {
                            if (res.data?.user) {
                                this.currentUser.set(res.data.user);
                            }
                        });
                    }

                    console.log(
                        'token exp: ',
                        this.jwt.getTokenExpiry(this.tokensService.accessToken()),
                    );
                    console.log('access token: ', this.tokensService.accessToken());
                    console.log('refresh token: ', this.tokensService.refreshToken());
                    console.log('isAuth: ', this.isAuth());
                    console.log('user: ', this.currentUserId());
                    this.currentUserPassword.set(args.password);
                    this.router.navigate(['/users']);
                }),
            );
    }

    verify_login(args: AuthInput): Observable<LoginResult> {
        return this.apollo
            .query<LoginResult, LoginArgs>({
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
                tap((authResult) => {
                    console.log('isAuth: ', this.isAuth());
                    //this.accessToken.set(authResult.login.access_token);
                    this.tokensService.setTokens(
                        authResult.login.access_token,
                        authResult.login.refresh_token,
                    );

                    this._currentUserId.set(authResult.login.user.id);

                    if (this._currentUserId()) {
                        this.usersService.getUser(this._currentUserId() ?? '').subscribe((res) => {
                            if (res.data?.user) {
                                this.currentUser.set(res.data.user);
                            }
                        });
                    }

                    console.log(
                        'token exp: ',
                        this.jwt.getTokenExpiry(this.tokensService.accessToken()),
                    );
                    console.log('access token: ', this.tokensService.accessToken());
                    console.log('refresh token: ', this.tokensService.refreshToken());
                    console.log('isAuth: ', this.isAuth());
                    console.log('user: ', this.currentUserId());
                }),
            );
    }

    signup(auth: SignupArgs['auth']): Observable<any> {
        return this.apollo
            .mutate<SignupResult>({
                mutation: SIGNUP,
                variables: { auth: auth },
            })
            .pipe(
                map((response) => {
                    if (!response.data || !response.data.signup) {
                        throw new Error('Signup failed: Server returned empty data');
                    }
                    return response.data;
                }),
                tap((authResult) => {
                    console.log('isAuth: ', this.isAuth());
                    //this.accessToken.set(authResult.login.access_token);
                    this.tokensService.setTokens(
                        authResult.signup.access_token,
                        authResult.signup.refresh_token,
                    );

                    this._currentUserId.set(authResult.signup.user.id);

                    if (this._currentUserId()) {
                        this.usersService.getUser(this._currentUserId() ?? '').subscribe((res) => {
                            if (res.data?.user) {
                                this.currentUser.set(res.data.user);
                            }
                        });
                    }

                    console.log(
                        'token exp: ',
                        this.jwt.getTokenExpiry(this.tokensService.accessToken()),
                    );
                    console.log('access token: ', this.tokensService.accessToken());
                    console.log('isAuth: ', this.isAuth());
                    console.log('user: ', this.currentUserId());
                    this.router.navigate(['/users']);
                }),
            );
    }

    forgot(auth: ForgotPasswordInput): Observable<void> {
        return this.apollo
            .mutate<void>({
                mutation: FORGOT,
                variables: { auth },
            })
            .pipe(
                map((response) => {
                    return response.data;
                }),
                tap((authResult) => console.log(authResult)),
            );
    }
}
