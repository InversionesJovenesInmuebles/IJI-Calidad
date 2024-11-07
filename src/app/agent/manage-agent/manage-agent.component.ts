import {Component, OnInit} from '@angular/core';
import {Agent} from "../../interfaces/agent";
import {Router} from "@angular/router";
import {RealEstate} from "../../interfaces/real-estate";
import {RealEstateService} from "../../services/real-estate.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-manage-agent',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './manage-agent.component.html',
  styleUrl: './manage-agent.component.scss'
})
export class ManageAgentComponent implements OnInit {
  isModalOpen = false;
  isErrorModalOpen = false; // Modal para el error
  agentes: Agent[] = [];
  agenteAEliminar: Agent | null = null;
  alertMessage: string | null = null;
  errorModalMessage: string | null = null; // Mensaje de error personalizado

  constructor(private router: Router, private realEstateService: RealEstateService) {}

  ngOnInit(): void {
    this.getRealEstateName();
  }

  getRealEstateName(): void {
    this.realEstateService.getRealStateByToken().subscribe(
      (RealEstate: RealEstate) => {
        const nombreInmobiliaria = RealEstate.nombreInmobiliaria;
        this.listarAgentes(nombreInmobiliaria);
      },
      (error) => {
        console.error('Error al obtener datos de la inmobiliaria:', error);
      }
    );
  }

  listarAgentes(nombreInmobiliaria: string): void {
    this.realEstateService.listRealEstateAgents(nombreInmobiliaria).subscribe(
      (agentes) => {
        this.agentes = agentes;
        console.log(agentes);
      },
      (error) => {
        console.error('Error al listar agentes:', error);
      }
    );
  }

  openModal(agent: Agent): void {
    this.isModalOpen = true;
    this.agenteAEliminar = agent;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.agenteAEliminar = null;
  }

  closeErrorModal(): void {
    this.isErrorModalOpen = false;
    this.isModalOpen = false; // Cerrar también el modal de confirmación
    this.errorModalMessage = null;
  }

  eliminarSi(): void {
    if (this.agenteAEliminar) {
      this.realEstateService.delAgent(this.agenteAEliminar.idAgente).subscribe(
        () => {
          console.log('Agente inmobiliario eliminado');
          this.alertMessage = `El agente ${this.agenteAEliminar?.nombre} ${this.agenteAEliminar?.apellido} ha sido eliminado correctamente.`;
          this.getRealEstateName();
          this.closeModal();

          setTimeout(() => {
            this.alertMessage = null;
          }, 3000);
        },
        (error) => {
          console.error('Error al eliminar agente:', error);
          if (error.status === 409) {
            // Mostrar el modal de error con el mensaje personalizado
            this.errorModalMessage = `El agente ${this.agenteAEliminar?.nombre} ${this.agenteAEliminar?.apellido} no se puede eliminar porque tiene propiedades registradas a su nombre.`;
            this.isErrorModalOpen = true;
          } else {
            this.alertMessage = 'Ha ocurrido un error inesperado. Intente nuevamente.';
          }
        }
      );
    }
  }

  eliminarNo(): void {
    this.closeModal();
  }

  modificarAgente(idAgent: number): void {
    console.log('ID del agente:', idAgent);
    this.router.navigate(['/modAgent', idAgent]);
  }
}

