import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokensService } from '../services/tokens-service';

export const tokensInterceptor: HttpInterceptorFn = (req, next) => {

  const tokensService = inject(TokensService);

  tokensService.checkExpAndUpdate();

  let resReq = req;

  if(req.headers.has('X-UPDATE')){
    resReq = req.clone({
      headers: req.headers.delete('X-UPDATE'),
    });
  }
  else{
      resReq = req.clone({
        setHeaders: { Authorization: `Bearer ${tokensService.accessToken()}` }
      });
  }

  return next(resReq);
};
