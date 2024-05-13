/* eslint-disable no-useless-constructor */
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Storage } from '@ionic/storage-angular'
import { AuthenticationService } from 'src/app/_services/authentication.service'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  constructor (private router: Router, private storage: Storage, public authService: AuthenticationService) {
  }

  async ngOnInit () {
    this.instrumentos.forEach(async element => {
      element.avaliable = await this.authService.isRole(element.instrument)
    })
  }

  public instrumentos: {instrument: string, avaliable: boolean}[] = [
    { instrument: 'DIRECTOR', avaliable: false },
    { instrument: 'FLAUTA', avaliable: false },
    { instrument: 'CLARINETE', avaliable: false },
    { instrument: 'SAXO SOPRANO', avaliable: false },
    { instrument: 'SAXO ALTO', avaliable: false },
    { instrument: 'TROMPETA', avaliable: false },
    { instrument: 'FLISCORNO', avaliable: false },
    { instrument: 'TROMPA', avaliable: false },
    { instrument: 'SAXO TENOR', avaliable: false },
    { instrument: 'TROMBON', avaliable: false },
    { instrument: 'BOMBARDINO', avaliable: false },
    { instrument: 'SAXO BARITONO', avaliable: false },
    { instrument: 'TUBA', avaliable: false },
    { instrument: 'CAJA', avaliable: false },
    { instrument: 'BOMBO PLATILLOS', avaliable: false },
    { instrument: 'PERCUSION', avaliable: false }
  ]

  public async onClick (instrument: string): Promise<void> {
    await this.storage.create()// Asegúrate de que la base de datos esté creada
    await this.storage.set('INSTRUMENT', instrument)
    this.router.navigateByUrl('instrument-list')
  }
}
