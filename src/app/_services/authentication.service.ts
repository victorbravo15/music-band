/* eslint-disable dot-notation */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, map, switchMap, from, tap } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IUser } from '../models/iUser'
import { User } from '../models/user'
import * as CryptoJS from 'crypto-js'
import { Storage } from '@ionic/storage-angular'

// const { App } = Plugins
const USER_KEY = 'user'
const encKey = 'NVDDf#QXv08Nm@HA'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  token = ''
  private baseUrl = environment.apiUrl
  private user: User | undefined
  private encript: any
  logoutTimer = new BehaviorSubject(0)

  constructor (private http: HttpClient, private router: Router, private storage: Storage) {
    this.loadUser()

    if (this.logoutTimer.value > 0) {
      this.lockApp()
    }
  }

  private async initStorage () {
    await this.storage.create()// Asegúrate de que la base de datos esté creada
  }

  private async loadUser () {
    await this.initStorage()
    if (this.storage) {
      const data = await this.storage.get(USER_KEY)
      if (data && data.value) {
        const user = JSON.parse(data.value)
        this.user = user
        this.token = user.jwt
        this.isAuthenticated.next(true)
      } else {
        this.isAuthenticated.next(false)
      }
    } else {
      console.error('Storage is not initialized.')
    }
  }

  public getToken () {
    this.loadUser()
    return this.token
  }

  async login (credentials: {email: any, password: any, recordar: any}): Promise<Observable<any>> {
    const verify = credentials.recordar
    this.encript = this.setEncrypt(credentials.password)

    const headers = new HttpHeaders().set('content-type', 'application/json')
    const body = {
      username: credentials.email,
      password: credentials.password
    }

    if (verify) {
      await this.storage.set('MAIL_KEY', credentials.email)
      await this.storage.set('PASS_KEY', this.encript)
    }

    const r = this.http.post(this.baseUrl + 'user/login', body, { headers })

    const call = r.pipe(
      map((data: any) => data),
      switchMap(user => {
        return from(this.storage.set(USER_KEY, JSON.stringify(user)))
      }),
      tap(_ => {
        this.isAuthenticated.next(true)
      })
    )

    return call
  }

  async logout (): Promise<void> {
    this.isAuthenticated.next(false)
    return await this.storage.remove(USER_KEY)
  }

  async getMail () {
    const mail = await this.storage.get('MAIL_KEY')
    return mail ? mail.value : null
  }

  async getPass () {
    const pass = await this.storage.get('PASS_KEY')
    return pass ? pass.value : null
  }

  async removePass_User () {
    await this.storage.remove('PASS_KEY')
    await this.storage.remove('MAIL_KEY')
  }

  setEncrypt (value: { toString: () => any }) {
    const key = CryptoJS.enc.Utf8.parse(encKey)
    const iv = CryptoJS.enc.Utf8.parse(encKey)
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

    return encrypted.toString()
  }

  // The get method is use for decrypt the value.
  getEncrypt (value: any) {
    if (value !== null && value !== undefined) {
      // Resto del código para descifrar aquí
      const key = CryptoJS.enc.Utf8.parse(encKey)
      const iv = CryptoJS.enc.Utf8.parse(encKey)
      const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return decrypted.toString(CryptoJS.enc.Utf8)
    } else {
      return null
    }
  }

  resetLogoutTimer () {
    this.logoutTimer.next(10)
    this.decreaseTimer()
  }

  decreaseTimer () {
    setTimeout(() => {
      if (this.logoutTimer.value === 0) {
        this.lockApp()
      } else {
        this.logoutTimer.next(this.logoutTimer.value - 1)
        this.decreaseTimer()
      }
    }, 1000)
  }

  lockApp () {
    this.logoutTimer.next(0)
    this.logout()
    this.router.navigateByUrl('login')
    this.resetLogoutTimer()
  }

  createUser (user: IUser) {
    // const bearer = 'Bearer ' + this.getToken()
    const headers = new HttpHeaders().set('content-type', 'application/json')

    const r = this.http.put(this.baseUrl + 'user/adduser', user, { headers })

    return r
  }
}
