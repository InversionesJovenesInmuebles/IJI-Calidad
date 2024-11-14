export interface Department {
  latitud: string;
  longitud: string;
  pais: string;
  region: string;
  provincia: string;
  distrito: string;
  direccion: string;
  descripcion: string;
  otrasComodidades: string;
  tipoPropiedad: string;
  areaTerreno: number;
  costoTotal: number;
  costoInicial: number;
  cochera: boolean;
  cantBanos: number;
  cantDormitorios: number;
  cantCochera: number;
  pisos: number;
  interior: number;
  ascensor: boolean;
  areasComunes: boolean;
  areasComunesEspecificas: string;
  fotosUrls: string[];
}
