/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AlertController, LoadingController } from '@ionic/angular'
import { AuthenticationService } from 'src/app/_services/authentication.service'
import { UtilService } from 'src/app/_services/util.service'
import { IUser } from 'src/app/models/iUser'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public username: string = ''
  public pass: string = ''
  public user!: IUser
  public credentials: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    recordar: [false]
  })

  showPassword = false
  passwordToggleIcon = 'eye'

  public constructor (
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private util: UtilService
  ) { }

  ngOnInit () {
    this.user = {
      username: '',
      password: ''
    }
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordar: [false]
    })

    const mail = this.authService.getMail().then((x) => {
      const pass = this.authService.getPass().then((y) => {
        this.credentials.controls['email'].setValue(x)
        const desencript = this.authService.getEncrypt(y)

        this.credentials.controls['password'].setValue(desencript)
        if (y != null) {
          this.credentials.controls['recordar'].setValue(true)
        }
      })
    })
  }

  async login () {
    const loading = await this.loadingController.create()
    await loading.present()

    if (!this.credentials.controls['recordar'].value) {
      this.authService.removePass_User()
    }

    // tslint:disable-next-line: deprecation
    (await
    // tslint:disable-next-line: deprecation
    this.authService.login(this.credentials.value)).subscribe(
      async (res) => {
        await loading.dismiss()
        this.router.navigateByUrl('tabs')
      },
      async (res) => {
        await loading.dismiss()
        const alert = await this.alertController.create({
          header: 'Inicio de Sesion Fallido',
          message: res.error.error,
          buttons: ['OK']
        })
        await alert.present()
      }
    )
  }

  get email () {
    return this.credentials.get('email')
  }

  get password () {
    return this.credentials.get('password')
  }

  public get recordar () {
    return this.credentials.get('recordar')
  }

  tooglePassword () {
    this.showPassword = !this.showPassword

    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }

  async createUser () {
    const loading = await this.loadingController.create({
      message: 'Calculating, please wait...'
    })
    await loading.present()
    this.user.username = this.username
    this.user.password = this.pass
    // this.credentials.controls.password.value;

    const p = new Promise(
      resolve => {
        const r = this.authService.createUser(this.user)

        r.subscribe(resp => {
          const dOut = resp as IUser
          if (dOut == null) {
            loading.dismiss()
            this.util.showAlertOk('Error', 'Error al crear el usuario')
          } else {
            loading.dismiss()
            this.util.showAlertOk('Creado', 'Usuario creado satisfactoriamente')
          }

          resolve(true)
        },
        () => {
          loading.dismiss()
          resolve(false)
        })
      }
    )
  }
}
