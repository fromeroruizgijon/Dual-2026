import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos coger el token del almacenamiento local
  const token = localStorage.getItem('auth_token');

  // 2. Si el token existe, clonamos la petición y le añadimos la cabecera Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // 3. Si no hay token, la petición sigue su curso normal
  return next(req);
};
