import {Property} from "./property";

export interface HouseProperty extends Property{
  cantPisos: number;
  areaJardin: number;
  jardin: boolean;
  atico: boolean;
  sotano: boolean;
}
