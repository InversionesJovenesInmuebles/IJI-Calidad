import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RegisterAgentRequest} from "../interfaces/register-agent-request";
import {Observable} from "rxjs";
import {Agent} from "../interfaces/agent";
import {RealEstate} from "../interfaces/real-estate";

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {

  private baseUrl: string = 'https://iji-calidad.onrender.com/inmobiliaria';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Agregar agente
  registerAgent(request: RegisterAgentRequest, token: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/registrarAgente`, request, { headers });
  }


  // Listar agentes por inmobiliaria
  listRealEstateAgents(nombreInmobiliaria: string): Observable<Agent[]> {
    const headers = this.getHeaders();
    return this.http.get<Agent[]>(`${this.baseUrl}/listarAgentes/${nombreInmobiliaria}`, { headers });
  }

  //Obtener datos inmobiliaria por token
  getRealStateByToken(): Observable<RealEstate> {
    const headers = this.getHeaders();
    return this.http.get<RealEstate>(`${this.baseUrl}/listarInmobiliariaToken`, { headers });
  }

  // Obtener agente por ID
  getAgentById(id: number): Observable<Agent> {
    const headers = this.getHeaders();
    return this.http.get<Agent>(`${this.baseUrl}/obtenerAgente/${id}`, { headers });
  }

  // Modificar agente
  modAgent(id: number, request: RegisterAgentRequest): Observable<Agent> {
    const headers = this.getHeaders();
    return this.http.put<Agent>(`${this.baseUrl}/modificarAgente/${id}`, request, { headers });
  }

  // Eliminar agente
  delAgent(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/eliminar/${id}`, { headers });
  }

  // Listar a todos los agentes
  listAgents(): Observable<Agent[]> {
    const headers = this.getHeaders();
    return this.http.get<Agent[]>(`${this.baseUrl}/listarAgentes`, { headers });
  }
}
