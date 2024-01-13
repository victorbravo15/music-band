/* eslint-disable dot-notation */
/* eslint-disable no-useless-constructor */
import { Injectable } from '@angular/core'
import { CanLoad, Router } from '@angular/router'
import { Plugins } from '@capacitor/core'

export const INTRO_KEY = 'into-seen'
const { Storage } = Plugins

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor (private router: Router) { }

  async canLoad (): Promise<boolean> {
    const hasSeenIntro = await Storage['get']({ key: INTRO_KEY })
    if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
      return true
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl: true })
      return false
    }
  }
}
