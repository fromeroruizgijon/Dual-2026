import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //si la petición va a la api no se le pasa token por qué no es un parámetro válido
  if (req.url.includes('themealdb.com')) {
    return next(req);
  }
  //se recoge el token del localstorage
  const token = localStorage.getItem('auth_token');
  // si el token existe se clona y se añade a la cabecera
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  // si no hay token se envia la petición normal
  return next(req);
};