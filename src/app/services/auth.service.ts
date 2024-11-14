import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from "../interfaces/auth-response";
import { LoginRequest } from "../interfaces/login-request";
import { RegisterClientRequest } from "../interfaces/register-client-request";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'https://iji-calidad.onrender.com/auth';
  private roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getRoleFromLocalStorage());

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response: AuthResponse) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
        }
        this.roleSubject.next(response.role);
      })
    );
  }

  registerClient(request: RegisterClientRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/registrar/cliente`, request);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    this.roleSubject.next('Guest');
  }

  getRole(): Observable<string> {
    return this.roleSubject.asObservable();
  }

  private getRoleFromLocalStorage(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('role')) {
      return localStorage.getItem('role') || 'Guest';
    }
    return 'Guest';
  }

  Role(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') || 'Guest';
    }
    return 'Guest';
  }
}
