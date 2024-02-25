import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Rol } from '../interfaces/authorized-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeUserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAccess(route.data['allowedRoles']);
  }

  private checkAccess(allowedRoles: Rol[]): Observable<boolean> {
    return this.authService.isValidToken().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login');
        }
        const userRole = this.authService.userRol;
        if (allowedRoles.includes(userRole)) {
          return true;
        } else {
          this.authService.logout();
          this.router.navigate(['/forbidden']);
          return false;
        }
      })
    );
  }
}
