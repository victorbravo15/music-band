/* eslint-disable no-useless-constructor */
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public isSmallScreen: boolean = false;
  private urlHistory!: string[];

  constructor(
    private alertController: AlertController,
    private platform: Platform
  ) {
    this.detectScreenWidth();
  }

  public async showAlertOk(headerText: string, messageText: string): Promise<void> {
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
    });

    await alert.present();
  }

  private getScreenSize(): boolean {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);
    return screenWidth < 850;
  }

  detectScreenWidth() {
    const checkScreenSize = () => this.platform.width() < 800;

    // Crear un observable que emitirá eventos cuando la pantalla cambie de tamaño
    const screenSizeChanges$ = fromEvent(window, 'resize').pipe(map(checkScreenSize));

    // Emitir el valor inicial
    const initialScreenSize$ = new Observable(subscriber => {
      subscriber.next(checkScreenSize());
      subscriber.complete();
    });

    // Fusionar el valor inicial y los cambios posteriores
    const screenSize$ = merge(initialScreenSize$, screenSizeChanges$);

    // Suscribirse al observable para recibir notificaciones de cambios de tamaño de pantalla
    screenSize$.subscribe(isScreenSmall => {
      this.isSmallScreen = isScreenSmall as boolean;
    });
  }
}
