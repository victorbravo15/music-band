/* eslint-disable no-useless-constructor */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { IDocumentDto } from '../models/iDocumentDto';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  private baseUrl = environment.apiUrl;
  descargarArchivoDesdeEnlace(enlaceCompartido: string): Observable<Object> {
    return this.http.get(enlaceCompartido, { responseType: 'blob' as 'json' });
  }

  uploadFile(formData: FormData) {
    const bearer = 'Bearer ' + this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.post(this.baseUrl + 'file/upload', formData, { headers });

    return r;
  }

  downloadFile(document: IDocumentDto) {
    const bearer = 'Bearer ' + this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.post(this.baseUrl + 'file/download', document, { headers, responseType: 'blob' });

    return r;
  }

  deleteFile(document: IDocumentDto) {
    const bearer = 'Bearer ' + this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.post(this.baseUrl + 'file/delete', document, { headers });

    return r;
  }

  async getDocumentList(instrument: string) {
    const bearer = 'Bearer ' + await this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.get(this.baseUrl + 'file/documentlist' + '?instrument=' + instrument, { headers });

    return r;
  }

  editDocumentListType(document: IDocumentDto) {
    const bearer = 'Bearer ' + this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', bearer);

    const r = this.http.post(this.baseUrl + 'file/editdocumenttype', document, { headers });

    return r;
  }
}
