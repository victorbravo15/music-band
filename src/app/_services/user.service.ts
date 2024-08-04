import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  private baseUrl = environment.apiUrl;

  async deleteUser(dto: any): Promise<Observable<any>> {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.post(`${this.baseUrl}user/deleteuser`, dto, { headers });

    return r;
  }

  async createUser(dto: any): Promise<Observable<any>> {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    return this.http.post<any>(`${this.baseUrl}user/createuser`, dto, { headers });
  }

  async updateUser(dto: any): Promise<Observable<any>> {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    return this.http.post<any>(`${this.baseUrl}user/updateuser`, dto, { headers });
  }

  async getUserById(id: number): Promise<Observable<any>> {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    return this.http.get<any>(`${this.baseUrl}user/getuser/${id}`, { headers });
  }

  async getUsers(): Promise<Observable<any[]>> {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    return this.http.get<any[]>(`${this.baseUrl}user/getusers`, { headers });
  }
}

