/* eslint-disable no-useless-constructor */
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from './authentication.service'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor (private http: HttpClient, private authService: AuthenticationService) {}

  private baseUrl = environment.apiUrl
  descargarArchivoDesdeEnlace (enlaceCompartido: string): Observable<Object> {
    return this.http.get(enlaceCompartido, { responseType: 'blob' as 'json' })
  }

  uploadFile (formData: FormData) {
    const bearer = 'Bearer ' + this.authService.getToken()
    const headers = new HttpHeaders().set('Authorization', bearer)

    const r = this.http.post(this.baseUrl + 'file/upload', formData, { headers })
    console.log(this.baseUrl + 'file/upload', formData)

    return r
  }
}
