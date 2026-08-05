import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokensService } from '../services/tokens-service';
import { switchMap } from 'rxjs';

export const tokensInterceptor: HttpInterceptorFn = (req, next) => {
    const tokensService = inject(TokensService);

    if (req.headers.has('X-UPDATE')) {
        return next(req);
    }
    // 2. Ждем получения валидного токена и только потом отправляем исходный запрос
    return tokensService.ensureValidToken().pipe(
        switchMap((accessToken) => {
            if (!accessToken) {
                return next(req);
            }

            const authorizedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return next(authorizedReq);
        })
    );
};
