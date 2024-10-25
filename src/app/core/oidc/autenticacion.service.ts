import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubjects para manejar el estado de autenticación y datos del usuario
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Configuración OIDC
  private oidcConfig = {
    authority: environment.oidc.authority,
    client_id: environment.oidc.clientId,
    redirect_uri: `${window.location.origin}/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    post_logout_redirect_uri: window.location.origin,
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar el BehaviorSubject con el usuario del localStorage
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkInitialAuth();
  }

  // Getters públicos
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Iniciar proceso de login
  login(): void {
    // Generar y guardar state para seguridad
    const state = this.generateRandomString();
    const nonce = this.generateRandomString();
    
    localStorage.setItem('auth_state', state);
    localStorage.setItem('auth_nonce', nonce);

    // Construir URL de autorización
    const authUrl = this.buildAuthUrl(state, nonce);
    window.location.href = authUrl;
  }

  // Manejar el callback de autenticación
  handleCallback(code: string, state: string): Observable<boolean> {
    const savedState = localStorage.getItem('auth_state');
    if (state !== savedState) {
      console.error('Invalid state');
      return of(false);
    }

    return this.getTokens(code).pipe(
      tap(response => this.handleAuthSuccess(response)),
      map(() => true),
      catchError(error => {
        console.error('Authentication error:', error);
        return of(false);
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    const logoutUrl = `${this.oidcConfig.authority}/connect/endsession?` +
      `post_logout_redirect_uri=${encodeURIComponent(this.oidcConfig.post_logout_redirect_uri)}`;
    
    window.location.href = logoutUrl;
  }

  // Renovar token
  renewToken(): Observable<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return of(false);
    }

    return this.http.post<any>(`${this.oidcConfig.authority}/connect/token`, {
      grant_type: 'refresh_token',
      client_id: this.oidcConfig.client_id,
      refresh_token: refreshToken
    }).pipe(
      tap(tokens => this.handleAuthSuccess(tokens)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // Métodos privados de utilidad
  private checkInitialAuth(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const isExpired = this.isTokenExpired(token);
      if (!isExpired) {
        this.isAuthenticatedSubject.next(true);
      } else {
        this.renewToken().subscribe();
      }
    }
  }

  private buildAuthUrl(state: string, nonce: string): string {
    const params = new URLSearchParams({
      client_id: this.oidcConfig.client_id,
      redirect_uri: this.oidcConfig.redirect_uri,
      response_type: this.oidcConfig.response_type,
      scope: this.oidcConfig.scope,
      state: state,
      nonce: nonce
    });

    return `${this.oidcConfig.authority}/connect/authorize?${params.toString()}`;
  }

  private getTokens(code: string): Observable<any> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.oidcConfig.client_id,
      code: code,
      redirect_uri: this.oidcConfig.redirect_uri
    });

    return this.http.post(
      `${this.oidcConfig.authority}/connect/token`,
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
  }

  private handleAuthSuccess(response: any): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    const userData = this.parseJwt(response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    this.currentUserSubject.next(userData);
    this.isAuthenticatedSubject.next(true);
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private generateRandomString(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const userData = this.parseJwt(token);
    if (!userData) return true;
    
    const expires = userData.exp * 1000; // Convertir a milisegundos
    return Date.now() >= expires;
  }

  // Método para obtener el token actual
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}