/* eslint-disable dot-notation */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, switchMap, from, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iUser';
import { User } from '../models/user';
import * as CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage-angular';

// const { App } = Plugins
const USER_KEY = 'user';
const USER_ROLES = 'ROLES';
const encKey = 'NVDDf#QXv08Nm@HA';
const DATE_KEY = 'loginDate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  token = '';
  private baseUrl = environment.apiUrl;
  private user: User | undefined;
  private encript: any;
  logoutTimer = new BehaviorSubject(0);

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {
    this.initStorage();
    this.loadUser();

    if (this.logoutTimer.value > 0) {
      this.lockApp();
    }
  }

  private async initStorage() {
    await this.storage.create();// Asegúrate de que la base de datos esté creada
    const data = await this.storage.get(USER_KEY);
    const date = await this.storage.get(DATE_KEY);
    const elapsedMilliseconds = new Date().getTime() - date;
    const eightHoursInMillis = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    if (data && elapsedMilliseconds <= eightHoursInMillis) {
      const user = JSON.parse(data);
      this.user = user;
      this.token = user.jwt;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
      this.logout();
    }
  }

  private async loadUser() {
    if (this.storage) {
      const data = await this.storage.get(USER_KEY);
      if (data) {
        const user = JSON.parse(data);
        this.user = user;
        this.token = user.jwt;
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    } else {
      console.error('Storage is not initialized.');
    }
  }

  public async getToken() {
    await this.loadUser();
    return this.token;
  }

  async login(credentials: { email: any, password: any, recordar: any }): Promise<Observable<any>> {
    const verify = credentials.recordar;
    this.encript = this.setEncrypt(credentials.password);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    const body = {
      username: credentials.email,
      password: credentials.password
    };

    if (verify) {
      await this.storage.set('MAIL_KEY', credentials.email);
      await this.storage.set('PASS_KEY', this.encript);
    }
    this.storage.set(DATE_KEY, new Date().getTime());

    const r = this.http.post(this.baseUrl + 'user/login', body, { headers });

    const call = r.pipe(
      map((data: any) => data),
      switchMap(user => {
        this.storage.set(USER_ROLES, this.setEncrypt(user.roles ?? ''));
        return from(this.storage.set(USER_KEY, JSON.stringify(user)));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );

    return call;
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    await this.storage.remove(USER_KEY);
    await this.storage.remove(USER_ROLES);
    await this.storage.remove('INSTRUMENT');
    this.router.navigateByUrl('/');
  }

  async getMail() {
    const mail = await this.storage.get('MAIL_KEY');
    return mail || null;
  }

  async getPass() {
    const pass = await this.storage.get('PASS_KEY');
    return pass || null;
  }

  async removePass_User() {
    await this.storage.remove('PASS_KEY');
    await this.storage.remove('MAIL_KEY');
  }

  setEncrypt(value: { toString: () => any }) {
    const key = CryptoJS.enc.Utf8.parse(encKey);
    const iv = CryptoJS.enc.Utf8.parse(encKey);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  // The get method is use for decrypt the value.
  getEncrypt(value: any) {
    if (value !== null && value !== undefined) {
      // Resto del código para descifrar aquí
      const key = CryptoJS.enc.Utf8.parse(encKey);
      const iv = CryptoJS.enc.Utf8.parse(encKey);
      const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return null;
    }
  }

  resetLogoutTimer() {
    this.logoutTimer.next(10);
    this.decreaseTimer();
  }

  decreaseTimer() {
    setTimeout(() => {
      if (this.logoutTimer.value === 0) {
        this.lockApp();
      } else {
        this.logoutTimer.next(this.logoutTimer.value - 1);
        this.decreaseTimer();
      }
    }, 1000);
  }

  lockApp() {
    this.logoutTimer.next(0);
    this.logout();
    this.router.navigateByUrl('login');
    this.resetLogoutTimer();
  }

  createUser(user: IUser) {
    // const bearer = 'Bearer ' + this.getToken()
    const headers = new HttpHeaders().set('content-type', 'application/json');

    const r = this.http.put(this.baseUrl + 'user/adduser', user, { headers });

    return r;
  }

  public async isRole(instrument: string): Promise<boolean> {
    let userRoles: string | null = '';
    const roles = await this.storage.get(USER_ROLES);
    userRoles = this.getEncrypt(roles as string);
    const userRolesList = userRoles?.split(';');
    if (userRolesList?.includes('DIRECTOR')) {
      return true;
    } else if (userRolesList?.includes(instrument)) {
      return true;
    }
    return false;
  }

  refreshPage() {
    window.location.href = window.location.pathname + '?random=' + Math.random();
  }
}
