/* eslint-disable no-useless-constructor */
import { Component } from '@angular/core'
import { Router } from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor (private router: Router) { }

  public instrumentos: string[] = [
    'DIRECTOR',
    'BOMBO PLATILLOS',
    'CAJA',
    'PERCUSION',
    'TUBA',
    'BOMBARDINO',
    'TROMBON',
    'TROMPA',
    'TROMPETA',
    'FLISCORNO',
    'SAXO ALTO',
    'CLARINETE',
    'FLAUTA',
    'SAXO SOPRANO',
    'SAXO BARITONO',
    'SAXO TENOR'
  ]

  public onClick (): void {
    this.router.navigateByUrl('instrument-list')
  }
}
