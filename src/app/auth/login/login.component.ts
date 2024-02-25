import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm!: FormGroup;
  public currentRoute!: string;
  public routeSubs$!: Subscription;
  public type: string = 'password';
  public visibility: boolean = true;
  public error: any = error;

  @ViewChild('googleLogin') googleLogin!: ElementRef;

  constructor(
    private formBuider: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.routeSubs$ = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.routeSubs$.unsubscribe;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuider.group({
      email: [
        localStorage.getItem('user_email'),
        [Validators.required, Validators.email],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
      rememberme: [localStorage.getItem('rememberme-state')],
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_KEY,
      callback: (resp: any) => this.handleCredentialResponse(resp),
    });
    google.accounts.id.renderButton(this.googleLogin.nativeElement, {
      theme: 'dark',
      size: 'large',
    });
  }

  async handleCredentialResponse(response: any) {
    await this.authService
      .googleSingIn(response.credential, this.currentRoute)
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this._ngZone.run(() => {
              this.router.navigate(['/']);
            });
            success(response.message);
          }
        },
        (error: any) => this.error(error.error.message)
      );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberme() {
    return this.loginForm.get('rememberme')?.value;
  }

  changeVisibility() {
    this.visibility = !this.visibility;
    this.type === 'password' ? (this.type = 'text') : (this.type = 'password');
  }

  loginWithEmailAndPassword() {
    this.authService
      .loginWithEmailAndPassword(this.loginForm.value, this.currentRoute)
      .subscribe(
        (resp: any) => {
          if (resp.ok) {
            if (this.rememberme) {
              localStorage.setItem('rememberme-state', this.rememberme);
              localStorage.setItem('user_email', this.email?.value);
            } else if (!this.rememberme) {
              localStorage.removeItem('rememberme-state');
              localStorage.removeItem('user_email');
            }
            this.loginForm.reset();
            this.router.navigateByUrl('/');
            success(resp.message);
          }
        },
        (error) => {
          this.error(error.error.message);
        }
      );
  }
}
