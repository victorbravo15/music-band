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
}
