import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Property } from "../../interfaces/property";
import { Router } from "@angular/router";
import { PropertiesService } from "../../services/properties.service";
import { AgentService } from "../../services/agent.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-manage-properties',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './manage-properties.component.html',
  styleUrl: './manage-properties.component.scss'
})

export class ManagePropertiesComponent implements OnInit {
  isModalOpen = false;
  isDeleteModalOpen = false;
  deleteSuccessMessage = false;
  properties: Property[] = [];
  selectedProperty: Property | null = null;

  constructor(
    private router: Router,
    private propertiesService: PropertiesService,
    private agentService: AgentService
  ) {}

  ngOnInit() {
    this.chargeProperties();
  }

  chargeProperties() {
    this.propertiesService.listAgentProperties().subscribe((propiedades) => {
      this.properties = propiedades;
      console.log('Propiedades cargadas:', this.properties);
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openDeleteModal(property: Property) {
    this.selectedProperty = property;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedProperty = null;
  }

  confirmDelete() {
    if (this.selectedProperty) {
      const propiedadId = this.selectedProperty.idPropiedad;
      const propiedadTipo = this.selectedProperty.tipoPropiedad.toLowerCase();

      const deleteObservable = propiedadTipo === 'casa'
        ? this.agentService.delHouse(propiedadId)
        : this.agentService.delDepartment(propiedadId);

      deleteObservable.subscribe({
        next: (response) => {
          // Caso de éxito - Eliminar la propiedad de la lista
          console.log('Propiedad eliminada exitosamente', response);
          this.properties = this.properties.filter(p => p.idPropiedad !== propiedadId);
          this.mostrarMensajeExito();
          this.closeDeleteModal(); // Cerrar el modal
        },
        error: (err) => {
          // Manejar el error como éxito si el estado es 200
          if (err.status === 200) {
            console.log('Propiedad eliminada con código de estado 200 interpretado como error');
            this.properties = this.properties.filter(p => p.idPropiedad !== propiedadId);
            this.mostrarMensajeExito();
            this.closeDeleteModal();
          } else {
            console.error('Error al eliminar propiedad:', err);
          }
        }
      });
    }
  }


  mostrarMensajeExito() {
    this.deleteSuccessMessage = true;
    setTimeout(() => {
      this.deleteSuccessMessage = false;
    }, 3000); // Duración del mensaje de éxito
  }

  addHouse() {
    this.closeModal();
    this.router.navigate(['/addHouse']);
  }

  addApartment() {
    this.closeModal();
    this.router.navigate(['/addDepartment']);
  }

  modificarPropiedad(idPropiedad: number): void {
    const propiedad = this.properties.find(p => p.idPropiedad === idPropiedad);
    if (propiedad) {
      const tipoPropiedad = propiedad.tipoPropiedad.toLowerCase();
      if (tipoPropiedad === 'casa') {
        this.router.navigate(['/modHouse', idPropiedad]);
      } else if (tipoPropiedad === 'departamento') {
        this.router.navigate(['/modDepartment', idPropiedad]);
      }
    }
  }
}

