import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokensService } from '../services/tokens-service';

export const tokensInterceptor: HttpInterceptorFn = (req, next) => {
    const tokensService = inject(TokensService);

    let resReq = req;

    tokensService.checkExpAndUpdate();
    
    console.log('Else works', tokensService.accessToken());
    resReq = req.clone({
        setHeaders: { Authorization: `Bearer ${tokensService.accessToken()}` },
    });

    return next(resReq);
};
