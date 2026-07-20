import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { tokensInterceptor } from './interceptors/tokens-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes , withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokensInterceptor])),

    provideApollo(() => {

      const httpLink = inject(HttpLink);
      
      return {
        link: httpLink.create({
          uri: 'http://localhost:3001/api/graphql',
        }),
        cache: new InMemoryCache(),
      };
    })


  ],
};
