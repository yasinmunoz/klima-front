import { ProbabilidadPrecipitacion } from './ProbabilidadPrecipitacion';

export interface Prediccion {
  mediaTemperatura: number;
  unidadTemperatura: string;
  probPrecipitacion: ProbabilidadPrecipitacion[];
}
