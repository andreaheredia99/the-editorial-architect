import { authInterceptor } from './interceptors/auth-interceptor';
// activamos peticiones HTTP

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // controla errores
    provideRouter(routes), // activa router, navegación
    // hacer peticiones al backend
    provideHttpClient(
      withInterceptors([authInterceptor])
    ) 
  ]
};
