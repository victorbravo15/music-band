/* eslint-disable no-useless-constructor */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor (private http: HttpClient) {}

  descargarArchivoDesdeEnlace (enlaceCompartido: string): Observable<Object> {
    return this.http.get(enlaceCompartido, { responseType: 'blob' as 'json' })
  }
}
