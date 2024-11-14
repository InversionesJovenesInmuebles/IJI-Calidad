import {Component, OnInit} from '@angular/core';
import {Property} from "../../interfaces/property";
import {PropertiesService} from "../../services/properties.service";
import {PhotoService} from "../../services/photo.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit{
  properties: Property[] = [];
  imageUrls: { [key: number]: string } = {};

  constructor(private propertyService: PropertiesService, private photoService: PhotoService) {}

  ngOnInit() {
    this.propertyService.listProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
        // Log para ver la información de las propiedades
        console.log('Propiedades cargadas:', this.properties);

        // Cargar las imágenes para cada propiedad
        this.properties.forEach(propiedad => {
          propiedad.fotos.forEach(foto => {
            foto.nombreFoto = this.cleanFilename(foto.nombreFoto);
          });
          if (propiedad.fotos.length > 0) {
            this.loadImage(propiedad.idPropiedad, propiedad.fotos[0].nombreFoto);
          }
        });
      },
      (error) => {
        console.error('Error al cargar las propiedades', error);
      }
    );
  }

  loadImage(propiedadId: number, filename: string) {
    this.photoService.getPhoto(filename).subscribe(
      (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrls[propiedadId] = e.target.result;
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Error al cargar la imagen', error);
        this.imageUrls[propiedadId] = 'assets/img/CASA.png';
      }
    );
  }

  getFirstImageUrl(property: Property): string {
    return this.imageUrls[property.idPropiedad] || 'assets/img/CASA.png';
  }

  cleanFilename(filename: string): string {
    try {
      const url = new URL(filename);
      return url.pathname.split('/').pop() || filename;
    } catch (e) {
      // Si no es una URL válida, retorna el filename original
      return filename;
    }
  }
  getRouterLink(property: Property): string {
    const propetyType = property.tipoPropiedad;
    if (propetyType === 'casa' || propetyType === 'Casa' ) {
      return `/viewPropertyHouse/${property.idPropiedad}`;
    } else if (propetyType === 'departamento' || propetyType === 'Departamento') {
      return `/viewPropertyDepartment/${property.idPropiedad}`;
    } else {
      return `/verPropiedad/${property.idPropiedad}`; // Default route
    }
  }

}
