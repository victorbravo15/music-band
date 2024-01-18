/* eslint-disable no-useless-constructor */
import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private urlHistory!: string[]

  constructor (
    private alertController: AlertController
  ) {

  }

  public async showAlertOk (headerText: string, messageText: string): Promise<void> {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    })

    await alert.present()
  }

  isSmallScreen (): boolean {
    // Obtener el ancho de la pantalla
    const anchoPantalla = window.innerWidth

    // Verificar si el ancho es menor de 850 píxeles
    return anchoPantalla < 850
  }
}
