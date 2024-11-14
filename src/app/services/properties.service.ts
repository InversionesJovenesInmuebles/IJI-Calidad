import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AgentService} from "./agent.service";
import {Observable} from "rxjs";
import {Property} from "../interfaces/property";
import {HouseMod} from "../interfaces/house-mod";
import {DepartmentMod} from "../interfaces/department-mod";
import {Agent} from "../interfaces/agent";

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private baseUrl = 'https://iji-calidad.onrender.com/propiedad';

  constructor(private http: HttpClient, private agentService: AgentService) { }

  //Listar Propiedades
  listProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}/listarPropiedades`);
  }

  //Obtener Propiedades por ID
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/listarPropiedad/${id}`);
  }

  //Obtener Casa Por Id
  getHouseById(id: number): Observable<HouseMod> {
    return this.http.get<HouseMod>(`${this.baseUrl}/listarPropiedad/${id}`);
  }

  //Obtener Departamento Por Id
  getDepartmentById(id: number): Observable<DepartmentMod> {
    return this.http.get<DepartmentMod>(`${this.baseUrl}/listarPropiedad/${id}`);
  }
  //Listar Propiedades del Agente
  listAgentProperties(): Observable<Property[]> {
    return new Observable<Property[]>((observer) => {
      this.agentService.GetAgentData().subscribe((agent: Agent) => { // Aquí especificamos el tipo Agente
        this.http.get<Property[]>(`${this.baseUrl}/listarPropiedadesAgente/${agent.idAgente}`).subscribe(
          (propiedades) => {
            observer.next(propiedades);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      });
    });
  }
}
