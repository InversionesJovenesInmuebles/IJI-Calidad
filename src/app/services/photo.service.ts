import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private baseUrl = 'https://iji-calidad.onrender.com/fotos';

  constructor(private http: HttpClient) { }

  getPhoto(filename: string): Observable<Blob> {
    const url = `${this.baseUrl}/${filename}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
