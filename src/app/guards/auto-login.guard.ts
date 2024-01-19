/* eslint-disable no-useless-constructor */
import { Injectable } from '@angular/core'
import { Router, CanLoad } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map, take } from 'rxjs/operators'
import { AuthenticationService } from '../_services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor (private authService: AuthenticationService, private router: Router) { }

  canLoad (): Observable<boolean> {
    return this.authService.isAuthenticated.pipe( // Filtrar el valor del comportamiento inicial
      filter(val => val != null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/home', { replaceUrl: true })
          return false
        } else {
          return true
        }
      })
    )
  }
}
