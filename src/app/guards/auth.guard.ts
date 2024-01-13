/* eslint-disable no-useless-constructor */
import { Injectable } from '@angular/core'
import { CanLoad, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map, take } from 'rxjs/operators'
import { AuthenticationService } from '../_services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor (private authService: AuthenticationService, private router: Router) {}
  canLoad (): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val != null),
      take(1),
      map(isAthenticated => {
        if (isAthenticated) {
          return true
        } else {
          this.router.navigateByUrl('/login')
          return false
        }
      })
    )
  }
}
