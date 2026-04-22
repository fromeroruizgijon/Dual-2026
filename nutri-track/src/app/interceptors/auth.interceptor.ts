import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // --- EL TRUCO (EL BYPASS) ---
  // Si la petición va a la API externa de comida, que pase SIN TOKEN.
  if (req.url.includes('themealdb.com')) {
    return next(req);
  }
  // ----------------------------

  // 1. Intentamos coger el token del almacenamiento local (Para Laravel)
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