import {Photo} from "./photo";

export interface Property {
  idPropiedad: number;
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
  fotos: Photo[];
}
