import {
  HttpClient,
  httpResource,
  HttpResourceRef,
  HttpResourceRequest,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  // signal para almacenar el usuario autenticado
  user = signal<User | null>(null);
  router = inject(Router);

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/api/Auth/Register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/api/Auth/Login`, request, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Guardar los datos del usuario autenticado en el signal.
          this.setUser({
            email: response.email ?? request.email,
            userName: response.userName,
            roles: response.roles ?? [],
          });
        }),
      );
  }

  loadUser(): HttpResourceRef<User | undefined> {
    // Cargar los datos del usuario autenticado desde el backend y actualizar el signal.
    return httpResource<User>(() => {
      const request: HttpResourceRequest = {
        url: `${environment.apiBaseUrl}/api/auth/me`,
        withCredentials: true,
      };

      return request;
    });
  }

  // Cerrar la sesión del usuario en el backend y limpiar el signal.
  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiBaseUrl}/api/Auth/Logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  setUser(updateUser: User | null) {
    if (updateUser) {
      this.user.set(updateUser);
      this.user.set({
        email: updateUser.email,
        userName: updateUser.userName,
        roles: updateUser.roles.map((role) => role.toLowerCase()),
      });
    } else {
      this.user.set(null);
    }
  }
}
