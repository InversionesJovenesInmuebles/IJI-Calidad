import {Property} from "./property";

export interface DepartmentProperty extends Property {
  pisos: number;
  interior: number;
  ascensor: boolean;
  areasComunes: boolean;
  areasComunesEspecificas: string;
}
