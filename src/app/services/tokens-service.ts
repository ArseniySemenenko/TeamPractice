import { Service, inject, signal } from '@angular/core';
import { JwtService } from './jwt-service';
import { Apollo, gql } from 'apollo-angular';
import { UpdateTokenResult } from 'cv-graphql';
import { tap } from 'rxjs';
import { Observable , of , map , catchError} from 'rxjs';

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

    setTokens(access: string, refresh: string): void {

        this._accessToken.set(access);
        this._refreshToken.set(refresh);
    }

    clearTokens(): void {
        localStorage.setItem('access' , '');
        this._accessToken.set('');
        this._refreshToken.set('');
    }

    /**
     * Проверяет токен и обновляет его при необходимости.
     * Возвращает Observable<string> с актуальным access-токеном.
     */
    ensureValidToken(): Observable<string> {
        const currentToken = this._accessToken();
        
        if (!currentToken || this.isExpired(currentToken)) {
            return this.refreshTokens();
        }

        return of(currentToken);
    }

    private refreshTokens(): Observable<string> {
        const refreshToken = this._refreshToken();

        if (!refreshToken) {
            this.clearTokens();
            return of('');
        }

        return this.apollo
            .mutate<{ updateToken: UpdateTokenResult }>({
                mutation: UPDATE_TOKENS,
                context: {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                        'X-UPDATE': 'true', // Флаг для пропуска в интерцепторе
                    },
                },
            })
            .pipe(
                map((res) => res.data?.updateToken),
                tap((tokens) => {
                    if (tokens) {
                        this.setTokens(tokens.access_token, tokens.refresh_token);
                    }
                }),
                map((tokens) => tokens?.access_token ?? ''),
                catchError((err) => {
                    this.clearTokens();
                    throw err;
                })
            );
    }

    private isExpired(token: string): boolean {
        const exp = this.jwt.getTokenExpiry(token);
        if (!exp) return true;
        
        // Добавляем буфер в 5 секунд, чтобы токен не протух в момент перелета по сети
        const bufferMs = 5000;
        return Number(exp) <= Date.now() + bufferMs;
    }
}
