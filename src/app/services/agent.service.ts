import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Agent} from "../interfaces/agent";
// import {House} from "../interfaces/house";
// import {Department} from "../interfaces/department";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private baseUrl = 'https://iji-calidad.onrender.com/agente';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // Obtener el token del localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  GetAgentData(): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/listarAgenteToken`, {
      headers: this.getHeaders(),
    });
  }

  addHouse(formData: FormData): Observable<any> {
    return this.http.post<string>(`${this.baseUrl}/agregarCasa`, formData, {
      headers: this.getHeaders(),
    });
  }

  modHouse(id: number, houseData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/modificarCasa/${id}`, houseData, { headers });
  }

  delHouse(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/eliminarCasa/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addDepartment(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/agregarDepartamento`, formData, {
      headers: this.getHeaders(),
    });
  }

  modDepartment(id: number, departamentData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/modificarDepartamento/${id}`, departamentData, { headers });
  }

  delDepartment(id: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/eliminarDepartamento/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // private createCasaFormData(casa: House): FormData {
  //   const formData = new FormData();
  //   Object.keys(casa).forEach((key) => {
  //     if (key === 'fotosUrls') {
  //       casa.fotosUrls.forEach((foto) => formData.append('fotos', foto));
  //     } else {
  //       formData.append(key, (casa as any)[key]);
  //     }
  //   });
  //   return formData;
  // }
  //
  // private createDepartamentoFormData(departamento: Department): FormData {
  //   const formData = new FormData();
  //   Object.keys(departamento).forEach((key) => {
  //     if (key === 'fotosUrls') {
  //       departamento.fotosUrls.forEach((foto) =>
  //         formData.append('fotos', foto)
  //       );
  //     } else {
  //       formData.append(key, (departamento as any)[key]);
  //     }
  //   });
  //   return formData;
  // }
}
