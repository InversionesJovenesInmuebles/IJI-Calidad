import {Component, OnInit} from '@angular/core';
import {DepartmentProperty} from "../../interfaces/department-property";
import {ActivatedRoute} from "@angular/router";
import {PropertiesService} from "../../services/properties.service";
import {PhotoService} from "../../services/photo.service";
import {Property} from "../../interfaces/property";
import {Photo} from "../../interfaces/photo";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-view-property-department',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './view-property-department.component.html',
  styleUrl: './view-property-department.component.scss'
})
export class ViewPropertyDepartmentComponent implements OnInit{
  propiedad: DepartmentProperty | null = null;
  fotos: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private propertiesService: PropertiesService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.obtenerPropiedad(id);
    });
  }

  obtenerPropiedad(id: number): void {
    this.propertiesService.getPropertyById(id).subscribe((propiedad: Property) => {
      this.propiedad = propiedad as DepartmentProperty;  // Type assertion here
      this.cargarFotos(this.propiedad.fotos);
    });
  }

  cargarFotos(fotos: Photo[]): void {
    fotos.forEach(foto => {
      const nombreArchivo = this.extraerNombreArchivo(foto.nombreFoto);
      this.photoService.getPhoto(nombreArchivo).subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.fotos.push(url);
      });
    });
  }

  extraerNombreArchivo(url: string): string {
    const partes = url.split('/');
    return partes[partes.length - 1];
  }
}

