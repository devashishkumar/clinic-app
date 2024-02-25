import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap, map, Observable, catchError, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { LoginForm } from 'src/app/interfaces/auth.interface';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUserLogged!: User;
  public currentSideNav!: any;

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string {
    return sessionStorage.getItem('clinic_token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get userRol(){ return this.currentUserLogged.rol}

  logout() {
    sessionStorage.removeItem('clinic_token');
    google.accounts.id.revoke(this.currentUserLogged.email);
    this.router.navigateByUrl('/login');
  }

  loginWithEmailAndPassword(loginForm: LoginForm, currentRoute: string) {
    if (currentRoute === '/login/patient') {
      return this.http
        .post(`${environment.THECLINIC_API_URL}/login/patient`, loginForm)
        .pipe(
          tap((resp: any) => {
            sessionStorage.setItem('clinic_token', resp.token);
          })
        );
    }

    return this.http
      .post(`${environment.THECLINIC_API_URL}/login`, loginForm)
      .pipe(
        tap((resp: any) => {
          sessionStorage.setItem('clinic_token', resp.token);
        })
      );
  }

  userLogged(userLogged: User) {
    const {
      id,
      document_type,
      document_number,
      email,
      name,
      lastname,
      gender,
      phone,
      validationState,
      email_name,
      email_provider,
      rol,
      photo,
    } = userLogged;
    this.currentUserLogged = new User(
      id,
      document_type,
      document_number,
      email,
      name,
      lastname,
      gender,
      phone,
      validationState,
      email_name,
      email_provider,
      rol,
      photo
    );
  }

  sideNaveMenu(menu: any) {
    this.currentSideNav = menu;
  }

  googleSingIn(token: string, currentRoute: string) {
    if (currentRoute === '/login/patient') {
      return this.http
        .post(`${environment.THECLINIC_API_URL}/login/google/patient`, {
          token,
        })
        .pipe(
          tap((resp: any) => {
            sessionStorage.setItem('clinic_token', resp.token);
          })
        );
    }
    return this.http
      .post(`${environment.THECLINIC_API_URL}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          sessionStorage.setItem('clinic_token', resp.token);
        })
      );
  }

  isValidToken(): Observable<boolean> {
    return this.http
      .get(`${environment.THECLINIC_API_URL}/login/renew`, this.headers)
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.userLogged(resp.user);
            this.sideNaveMenu(resp.menu);
            sessionStorage.setItem('clinic_token', resp.token);
          }
        }),
        map((resp) => true),
        catchError((error) => of(false))
      );
  }
}
